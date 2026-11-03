import { docsSlugFromParams } from "@/lib/docs-markdown";
import { siteUrl } from "@/lib/site-url";
import { loadDocsMarkdown } from "@/services/docs-markdown";

// /docs/<path>.md lands here through the rewrite in next.config.mjs. The HTML
// page stays the one search engines index, so this twin never competes with it.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  const slug = docsSlugFromParams(path);
  const markdown = await loadDocsMarkdown(slug);
  if (!markdown) return new Response("Not found\n", { status: 404 });

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-robots-tag": "noindex",
      link: `<${siteUrl()}${slug}>; rel="canonical"`,
      "cache-control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
