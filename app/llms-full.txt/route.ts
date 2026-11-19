import { loadAllDocsMarkdown } from "@/services/docs-markdown";

// Prerendered and kept in the global ISR cache, refreshed hourly and on every
// publish (the revalidate webhook clears CONTENT_TAG, which its CMS reads carry).
// Not force-dynamic: the CDN cache is per region, so a crawler from a cold
// region waited ~2.5 s on the CMS fan-out and Lighthouse timed out on it.
export const revalidate = 3600;

export async function GET() {
  return new Response(await loadAllDocsMarkdown(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}
