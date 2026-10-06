const EXIT_ALL_HEALTHY = 0;
const EXIT_DEMO_UNHEALTHY = 1;
const EXIT_CHECK_ITSELF_FAILED = 2;

const API = process.env.CMSSY_API_URL ?? "https://api.cmssy.io";
const ORG = process.env.CMSSY_ORG_SLUG ?? "cmssy";
const WORKSPACE = process.env.CMSSY_WORKSPACE_SLUG ?? "cmssy";
const GALLERY_SLUG = process.env.CMSSY_DEMO_PAGE_SLUG ?? "/demos";

export const GALLERY_BLOCK = "docs-card-grid";
export const MINIMUM_RENDERED_CHARACTERS = 500;
const REQUEST_TIMEOUT_MS = 20_000;

const GALLERY_QUERY = `
  query DemoGallery($workspaceSlug: String!, $slug: String!) {
    public {
      page {
        get(workspaceSlug: $workspaceSlug, slug: $slug) {
          publishedBlocks { type content }
        }
      }
    }
  }
`;

export class CheckFailed extends Error {}

export function renderedCharacters(html) {
  return html
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

export function demosFrom(publishedBlocks, slug = GALLERY_SLUG) {
  const grids = (publishedBlocks ?? []).filter(
    (block) => block.type === GALLERY_BLOCK,
  );
  if (grids.length === 0) {
    throw new CheckFailed(
      `${slug} carries no ${GALLERY_BLOCK} block, so it lists no demos`,
    );
  }

  const demos = grids.flatMap((grid) =>
    (grid.content?.cards ?? []).map((card) => ({
      title: card.title ?? "(untitled)",
      url: card.url,
    })),
  );
  const withoutUrl = demos.filter((demo) => !demo.url);
  if (withoutUrl.length > 0) {
    throw new CheckFailed(`${withoutUrl.length} card(s) on ${slug} carry no url`);
  }
  if (demos.length === 0) throw new CheckFailed(`${slug} lists no demos`);
  return demos;
}

export function verdictFor({ status, html }) {
  if (status !== 200) return { ok: false, reason: `answered ${status}` };

  const characters = renderedCharacters(html);
  const headings = (html.match(/<h1\b/gi) ?? []).length;
  const measured = `${characters} rendered characters, ${headings} <h1>`;

  if (headings === 0) {
    return { ok: false, reason: `answered 200 with no <h1> (${measured})` };
  }
  if (characters < MINIMUM_RENDERED_CHARACTERS) {
    return {
      ok: false,
      reason: `answered 200 but rendered almost nothing (${measured}, floor ${MINIMUM_RENDERED_CHARACTERS})`,
    };
  }
  return { ok: true, reason: measured };
}

async function fetchWithTimeout(url, init) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: abort.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function publishedGalleryBlocks() {
  const endpoint = `${API}/public/${ORG}/${WORKSPACE}/graphql`;
  let res;
  try {
    res = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: GALLERY_QUERY,
        variables: { workspaceSlug: WORKSPACE, slug: GALLERY_SLUG },
      }),
    });
  } catch (cause) {
    throw new CheckFailed(`${endpoint} did not answer: ${cause}`);
  }
  if (!res.ok) throw new CheckFailed(`${endpoint} answered ${res.status}`);

  const body = await res.json();
  if (body.errors?.length) {
    throw new CheckFailed(
      `the delivery API refused the query: ${JSON.stringify(body.errors)}`,
    );
  }
  const page = body.data?.public?.page?.get;
  if (!page) throw new CheckFailed(`${GALLERY_SLUG} is not published`);
  return page.publishedBlocks;
}

async function inspect(demo) {
  let res;
  try {
    res = await fetchWithTimeout(demo.url, { redirect: "follow" });
  } catch (cause) {
    return { ...demo, ok: false, reason: `did not answer: ${cause}` };
  }
  const html = res.status === 200 ? await res.text() : "";
  return { ...demo, ...verdictFor({ status: res.status, html }) };
}

async function main() {
  const demos = demosFrom(await publishedGalleryBlocks());
  const seen = await Promise.all(demos.map(inspect));

  for (const demo of seen) {
    console.log(
      `${demo.ok ? "ok  " : "DEAD"}  ${demo.title} - ${demo.url} - ${demo.reason}`,
    );
  }
  const dead = seen.filter((demo) => !demo.ok);
  console.log(
    `\n${seen.length} demo(s) listed on ${GALLERY_SLUG}, ${dead.length} unhealthy`,
  );
  return dead.length === 0 ? EXIT_ALL_HEALTHY : EXIT_DEMO_UNHEALTHY;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  try {
    process.exitCode = await main();
  } catch (error) {
    if (error instanceof CheckFailed) {
      console.error(`the check could not run: ${error.message}`);
      process.exitCode = EXIT_CHECK_ITSELF_FAILED;
    } else {
      throw error;
    }
  }
}
