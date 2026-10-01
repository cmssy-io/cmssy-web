import { readFileSync } from "node:fs";

const EXIT_CURRENT = 0;
const EXIT_PROBLEM_FOUND = 1;
const EXIT_CHECK_ITSELF_FAILED = 2;

const LOCKED = /'?@cmssy\/([a-z-]+)@(\d+)\.(\d+)\.(\d+)/g;
const PINNED_BY_THE_SDK_NOT_BY_US = new Set(["types"]);
const RUNTIME_SDK_CMSSY_WEB_MUST_USE = ["core", "next", "react"];
const asJson = process.argv.includes("--json");

function seriesOf(version) {
  const [major, minor] = version.split(".");
  return `${major}.${minor}`;
}

function compare(a, b) {
  const [am, an, ap] = a.split(".").map(Number);
  const [bm, bn, bp] = b.split(".").map(Number);
  return am - bm || an - bn || ap - bp;
}

async function latestOf(name) {
  const res = await fetch(`https://registry.npmjs.org/@cmssy/${name}/latest`);
  if (!res.ok) throw new Error(`npm returned ${res.status} for @cmssy/${name}`);
  const { version } = await res.json();
  if (!version) throw new Error(`npm returned no version for @cmssy/${name}`);
  return version;
}

function declaredByUs() {
  const manifest = JSON.parse(readFileSync("package.json", "utf8"));
  const names = new Set();
  for (const field of ["dependencies", "devDependencies"]) {
    for (const name of Object.keys(manifest[field] ?? {})) {
      if (name.startsWith("@cmssy/")) names.add(name.slice("@cmssy/".length));
    }
  }
  return names;
}

function lockedVersions(lock) {
  const found = new Map();
  for (const [, name, major, minor, patch] of lock.matchAll(LOCKED)) {
    const version = `${major}.${minor}.${patch}`;
    if (!found.has(name)) found.set(name, new Set());
    found.get(name).add(version);
  }
  return found;
}

function typesPinnedByCore(lock, coreVersion) {
  const lines = lock.split("\n");
  let insideCore = false;

  for (const line of lines) {
    if (/^\s{2}\S/.test(line)) {
      insideCore = line.trim() === `'@cmssy/core@${coreVersion}':`;
      continue;
    }
    if (!insideCore) continue;
    const pin = line.match(/'@cmssy\/types':\s*(\d+\.\d+\.\d+)/);
    if (pin) return pin[1];
  }
  return null;
}

async function findProblems() {
  const lock = readFileSync("pnpm-lock.yaml", "utf8");
  const locked = lockedVersions(lock);
  if (locked.size === 0)
    throw new Error("no @cmssy package found in the lockfile");

  const problems = [];
  const declared = declaredByUs();

  for (const name of RUNTIME_SDK_CMSSY_WEB_MUST_USE) {
    if (!declared.has(name)) {
      problems.push({
        kind: "undogfooded",
        package: `@cmssy/${name}`,
        detail:
          "cmssy-web no longer declares it, so the lockfile entry comes from " +
          "something else and proves nothing about what this site exercises",
      });
    }
  }

  for (const [name, versions] of locked) {
    if (versions.size > 1) {
      problems.push({
        kind: "split",
        package: `@cmssy/${name}`,
        detail: `${versions.size} versions locked at once: ${[...versions].sort().join(", ")}`,
      });
    }
    if (PINNED_BY_THE_SDK_NOT_BY_US.has(name)) continue;
    if (!declared.has(name)) continue;

    const newest = [...versions].sort(compare).at(-1);
    const published = await latestOf(name);
    if (
      compare(newest, published) < 0 &&
      seriesOf(newest) !== seriesOf(published)
    ) {
      problems.push({
        kind: "drift",
        package: `@cmssy/${name}`,
        detail: `locked ${newest}, published ${published}`,
      });
    }
  }

  const core = locked.get("core");
  const types = locked.get("types");
  if (core && types) {
    const newestCore = [...core].sort(compare).at(-1);
    const expected = typesPinnedByCore(lock, newestCore);
    if (expected === null) {
      throw new Error(
        `the lockfile records no @cmssy/types for @cmssy/core@${newestCore}`,
      );
    }
    for (const version of types) {
      if (version !== expected) {
        problems.push({
          kind: "split",
          package: "@cmssy/types",
          detail: `locked ${version}, but @cmssy/core pins ${expected}`,
        });
      }
    }
  }

  return problems;
}

let problems;
try {
  problems = await findProblems();
} catch (error) {
  console.error(`Drift check failed: ${error.message}`);
  process.exit(EXIT_CHECK_ITSELF_FAILED);
}

if (asJson) {
  console.log(JSON.stringify(problems, null, 2));
} else if (problems.length === 0) {
  console.log(
    "cmssy-web declares the runtime SDK, is on its current minor, and " +
      "resolves one @cmssy/types.",
  );
} else {
  console.error("cmssy-web is out of alignment with the published @cmssy SDK:\n");
  for (const p of problems) {
    console.error(`  ${p.kind}: ${p.package} - ${p.detail}`);
  }
}

process.exit(problems.length === 0 ? EXIT_CURRENT : EXIT_PROBLEM_FOUND);
