import { indexNowKey } from "@/lib/indexnow";

// IndexNow ownership proof: the engine fetches this file and expects the key
// as its whole body. Without a key configured there is nothing to prove, so
// the path is simply not there.
export const dynamic = "force-dynamic";

export function GET() {
  const key = indexNowKey();
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
