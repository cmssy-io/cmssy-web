import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { CONTENT_TAG } from "@/services/pages";

// On-demand ISR webhook. cmssy calls this on any content.changed.
// Auth: shared secret via `?secret=` or `x-revalidate-secret` header.
//
// The whole site is refreshed on every call. cmssy's payload names what moved
// (`subject.kind` / `slug` / `ids`), but narrowing by it buys nothing here: a
// publish also reorders the nav, the sitemap and every parent listing, so the
// tag has to be cleared regardless.
export async function POST(request: NextRequest) {
  const secret = process.env.CMSSY_REVALIDATE_SECRET;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  // The nav, the site config and the page list are cached under one tag, so a
  // publish has to clear it too - otherwise a new page is live but missing
  // from every sidebar until the hourly window rolls over.
  // `expire: 0` - the tag is stale immediately, which is the point of a
  // publish webhook.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
