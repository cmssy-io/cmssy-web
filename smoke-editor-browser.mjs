import { chromium } from "playwright";

const baseUrl = (process.env.SMOKE_BASE_URL ?? "").replace(/\/+$/, "");
const secret = process.env.CMSSY_DRAFT_SECRET;
const path = process.env.SMOKE_PATH ?? "/pricing";
const TIMEOUT_MS = 25_000;

if (!baseUrl) {
  console.error("SMOKE_BASE_URL is required (the deployment to probe)");
  process.exit(2);
}
if (!secret) {
  console.error(
    "CMSSY_DRAFT_SECRET is required.\n" +
      "It is the workspace's own draft secret - the same value the admin puts\n" +
      "in the preview URL. Without it the app serves the public page, and a\n" +
      "public page satisfies every liveness assertion this check could make.",
  );
  process.exit(2);
}

const editUrl = `${baseUrl}${path}?cmssyEdit=1&cmssySecret=${encodeURIComponent(secret)}`;
const publicUrl = `${baseUrl}${path}`;

async function open(browser, url) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("[cmssy]")) {
      consoleErrors.push(message.text().split("\n").slice(0, 2).join(" "));
    }
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  const response = await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: TIMEOUT_MS,
  });
  return { context, page, response, consoleErrors, pageErrors };
}

async function probe(browser) {
  const failures = [];
  let blocks = 0;

  const edit = await open(browser, editUrl);
  if (edit.response?.status() !== 200) {
    failures.push(`edit ${path}: expected 200, got ${edit.response?.status()}`);
  }

  // Server-rendered, so this only proves the request reached the edit route.
  // It is here to stop the check passing on a plain public page when the
  // secret or the rewrite is wrong - without it every assertion below is
  // satisfied by the public site.
  if ((await edit.page.locator("[data-cmssy-editor]").count()) === 0) {
    failures.push(
      `edit ${path}: not in edit mode - no data-cmssy-editor. Wrong secret, or the rewrite to /cmssy-edit did not happen`,
    );
  }

  // On the edit route the blocks are client-rendered: the served HTML carries
  // none. Seeing them in a browser is the one assertion that proves the client
  // bundle ran, which is what a fetch-based check cannot reach.
  try {
    await edit.page.waitForSelector("[data-block-id]", { timeout: TIMEOUT_MS });
    blocks = await edit.page.locator("[data-block-id]").count();
  } catch {
    failures.push(
      `edit ${path}: no block mounted within ${TIMEOUT_MS / 1000}s - the client bundle did not render the page`,
    );
  }

  for (const error of edit.consoleErrors) failures.push(`console: ${error}`);
  for (const error of edit.pageErrors) failures.push(`uncaught: ${error}`);
  await edit.context.close();

  const pub = await open(browser, publicUrl);
  if ((await pub.page.locator("[data-cmssy-editor]").count()) > 0) {
    failures.push(
      `public ${path}: the editor is mounted without a secret (CMS-948)`,
    );
  }
  await pub.context.close();

  return { failures, blocks };
}

const browser = await chromium.launch();
let result;
try {
  result = await probe(browser);
  if (result.failures.length > 0) {
    console.warn("first attempt failed, retrying once");
    result = await probe(browser);
  }
} finally {
  await browser.close();
}

if (result.failures.length > 0) {
  console.error(`EDITOR BROKEN on ${baseUrl}${path}`);
  for (const failure of result.failures) console.error(`  - ${failure}`);
  console.error(
    "\nA healthy HTML response proves nothing here: cmssy-io/cmssy-web#152\n" +
      "shipped a page whose markup was correct and whose client bundle threw,\n" +
      "and the fetch-based check passed while the editor sat blank.",
  );
  process.exit(1);
}

console.log(`EDITOR OK on ${baseUrl}${path} (${result.blocks} blocks mounted)`);
