import { loadAllDocsMarkdown } from "@/services/docs-markdown";

// Reads the live page tree, so it must not be frozen at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await loadAllDocsMarkdown(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex",
      "cache-control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
