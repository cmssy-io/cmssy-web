import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { CONTENT_TAG } from "@/services/pages";

// On-demand ISR webhook. cmssy calls this on publish to refresh cached pages.
// Auth: shared secret via `?secret=` or `x-revalidate-secret` header.
// Optional `path` (e.g. "/about", "/pl/about") narrows the revalidation;
// omit it to refresh the whole site (layout scope).
export async function POST(request: NextRequest) {
  const secret = process.env.CMSSY_REVALIDATE_SECRET;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  let path: string | undefined =
    request.nextUrl.searchParams.get("path") ?? undefined;
  if (!path) {
    try {
      const body = (await request.json()) as { path?: string };
      path = body?.path;
    } catch {
      // no body - fall through to full revalidation
    }
  }

  // The nav, the site config and the page list are cached under one tag, so a
  // publish has to clear it too - otherwise a new page is live but missing
  // from every sidebar until the hourly window rolls over.
  // `expire: 0` - the tag is stale immediately, which is the point of a
  // publish webhook.
  revalidateTag(CONTENT_TAG, { expire: 0 });

  if (path) {
    revalidatePath(path);
  } else {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ revalidated: true, path: path ?? "/", now: Date.now() });
}
