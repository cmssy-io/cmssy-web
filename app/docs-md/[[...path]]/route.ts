import { docsSlugFromParams } from "@/lib/docs-markdown";
import { siteUrl } from "@/lib/site-url";
import { loadDocsMarkdown } from "@/services/docs-markdown";
import { docsPages } from "@/services/docs-search";

export const dynamic = "force-static";
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await docsPages();
  return [
    { path: [] },
    ...pages.map((page) => ({
      path: page.fullSlug
        .replace(/^\/docs\/?/, "")
        .split("/")
        .filter(Boolean),
    })),
  ];
}

// /docs/<path>.md lands here through the rewrite in next.config.mjs. The HTML
// page stays the one search engines index, so this twin never competes with it.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  const slug = docsSlugFromParams(path);
  const markdown = slug ? await loadDocsMarkdown(slug) : null;
  if (!slug || !markdown) return new Response("Not found\n", { status: 404 });

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-robots-tag": "noindex",
      link: `<${siteUrl()}${slug}>; rel="canonical"`,
    },
  });
}
