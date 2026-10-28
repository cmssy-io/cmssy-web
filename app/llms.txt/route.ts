import { labelForPage } from "@/lib/docs-nav";
import { localizedPath } from "@/lib/locale-path";
import { listChildPages, type ChildPage } from "@/services/pages";
import { siteUrl } from "@/lib/site-url";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";

// Reads the live page tree, so it must not be frozen at build time.
export const dynamic = "force-dynamic";

const INTRO = `> cmssy is a headless CMS with native commerce that an AI agent can run. You
> model structured content and products, and edit them visually or through any
> MCP client (Claude, Cursor, ...) via the cmssy MCP server; your own frontend
> renders them with the cmssy SDK (Next.js, Astro, Remix, React). cmssy never
> hosts your site.

## Key facts

- Content is composed from typed blocks; block schemas live in your frontend code.
- Data collections are models with records, delivered over a typed GraphQL API.
- Any MCP client connects through the cmssy MCP server and edits content, products and orders directly - never your code.
- Refunds, order cancellations and page deletes over MCP wait for a human confirmation.
- Built-in commerce: products, carts, orders, discounts, order pipelines. cmssy records payments; your payment provider processes them.
- Every field is multilingual by default.`;

function line(page: ChildPage, locale: string, base: string): string {
  return `- ${labelForPage(page, locale, locale)}: ${base}${localizedPath(page.fullSlug, locale, locale)}`;
}

/**
 * A page and everything under it, depth-first. Two levels below a section is
 * where the page tree stops in practice; the cap keeps a deep tree from
 * turning one crawler request into an unbounded fan-out.
 */
async function descendants(
  page: ChildPage,
  exclude: string | null,
  depth = 2,
): Promise<ChildPage[]> {
  if (depth === 0) return [];
  const children = (await listChildPages(page.fullSlug)).filter(
    (child) => child.id !== exclude,
  );
  const nested = await Promise.all(
    children.map(async (child) => [
      child,
      ...(await descendants(child, exclude, depth - 1)),
    ]),
  );
  return nested.flat();
}

export async function GET() {
  const [config, locales, topLevel] = await Promise.all([
    fetchSiteConfig(),
    resolveSiteLocales(),
    listChildPages("/"),
  ]);
  const locale = locales.defaultLocale;
  const base = siteUrl();
  const siteName = config?.siteName;
  const name =
    (typeof siteName === "object" && siteName
      ? (siteName[locale] ?? Object.values(siteName)[0])
      : siteName) || "cmssy";

  // Every page, straight from the CMS: one published today is listed today,
  // and nothing here can go stale on its own. The workspace's 404 page is the
  // one exclusion - pointing a crawler at an error helps nobody.
  const notFoundPageId = config?.notFoundPageId ?? null;
  const listed = topLevel.filter((page) => page.id !== notFoundPageId);
  const sections = await Promise.all(
    listed.map(async (page) => ({
      page,
      children: await descendants(page, notFoundPageId),
    })),
  );

  const trees = sections.filter(({ children }) => children.length > 0);
  const leaves = sections.filter(({ children }) => children.length === 0);

  const body = [
    `# ${name}`,
    "",
    INTRO,
    "",
    ...trees.flatMap(({ page, children }) => [
      `## ${labelForPage(page, locale, locale)}`,
      "",
      line(page, locale, base),
      ...children.map((child) => line(child, locale, base)),
      "",
    ]),
    ...(leaves.length > 0
      ? ["## Pages", "", ...leaves.map(({ page }) => line(page, locale, base)), ""]
      : []),
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
