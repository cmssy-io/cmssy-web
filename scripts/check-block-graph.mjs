import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";

const ROOT = process.cwd();
const ENTRY = resolve(ROOT, "cmssy/blocks.ts");
const FORBIDDEN = [/^cmssy\/config\./, /^services\//];
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs"];

function resolveSpecifier(fromFile, specifier) {
  const base = specifier.startsWith("@/")
    ? resolve(ROOT, specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(dirname(fromFile), specifier)
      : null;
  if (!base) return null;
  for (const ext of EXTENSIONS) {
    const candidate = `${base}${ext}`;
    if (existsSync(candidate) && !candidate.endsWith("/")) return candidate;
  }
  for (const ext of EXTENSIONS.slice(1)) {
    const candidate = `${base}/index${ext}`;
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function staticImports(code) {
  const withoutTypes = code.replace(
    /^\s*(?:import|export)\s+type\s[^;]*;/gm,
    "",
  );
  const withoutDynamic = withoutTypes.replace(/\bimport\s*\([^)]*\)/g, "");
  return [
    ...withoutDynamic.matchAll(/(?:from|export)\s*["']([^"']+)["']/g),
    ...withoutDynamic.matchAll(/^\s*import\s+["']([^"']+)["']/gm),
  ].map(([, specifier]) => specifier);
}

const seen = new Set();
const violations = [];

function walk(file, chain) {
  if (seen.has(file)) return;
  seen.add(file);

  const rel = relative(ROOT, file);
  if (FORBIDDEN.some((pattern) => pattern.test(rel))) {
    violations.push([...chain, rel].join("\n    -> "));
    return;
  }

  let code;
  try {
    code = readFileSync(file, "utf8");
  } catch {
    return;
  }

  if (/^\s*["']use server["']/.test(code)) return;

  for (const specifier of staticImports(code)) {
    const target = resolveSpecifier(file, specifier);
    if (target) walk(target, [...chain, rel]);
  }
}

walk(ENTRY, []);

if (violations.length > 0) {
  console.error(
    "The block registry is loaded in the browser by CmssyLazyEditor, so its\n" +
      "static import graph must never reach the cmssy config or a service that\n" +
      "does. Import the type instead, or load the value with a dynamic import\n" +
      "inside the loader.\n",
  );
  for (const chain of violations) console.error(`  ${chain}\n`);
  process.exit(1);
}

console.log(`block registry graph clean (${seen.size} modules)`);
