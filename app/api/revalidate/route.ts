import { CmssyWebhookError, verifyCmssyWebhook } from "@cmssy/core";
import { revalidatePath, revalidateTag } from "next/cache";
import { after, NextResponse, type NextRequest } from "next/server";
import {
  indexNowKey,
  submitToIndexNow,
  urlsForSubject,
  type ContentSubject,
} from "@/lib/indexnow";
import { siteUrl } from "@/lib/site-url";
import { CONTENT_TAG } from "@/services/pages";
import { resolveSiteLocales } from "@/services/site";

// On-demand ISR webhook. cmssy calls this on any content.changed.
// Auth: the HMAC signature cmssy already sends in `x-cmssy-signature`,
// verified against CMSSY_WEBHOOK_SECRET.
//
// The whole site is refreshed on every call. cmssy's payload names what moved
// (`subject.kind` / `slug` / `ids`), but narrowing by it buys nothing here: a
// publish also reorders the nav, the sitemap and every parent listing, so the
// tag has to be cleared regardless.
export async function POST(request: NextRequest) {
  const webhookId = request.headers.get("x-cmssy-webhook-id");
  const secret = process.env.CMSSY_WEBHOOK_SECRET;

  // 500, not 401: cmssy treats any 4xx as permanent and drops the event on the
  // first attempt, so a missing secret would silently discard every publish
  // until someone noticed. A 5xx is retried with backoff, which means setting
  // the variable repairs the gap instead of leaving a hole in it.
  if (!secret) {
    console.error(
      "revalidate: CMSSY_WEBHOOK_SECRET is not set, cannot authenticate",
      { webhookId },
    );
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }

  let subject: ContentSubject | undefined;
  try {
    const event = await verifyCmssyWebhook({
      body: await request.text(),
      signatureHeader: request.headers.get("x-cmssy-signature"),
      secret,
      // The sender re-signs with a fresh timestamp on every attempt and gives
      // up after 5s, so no honest delivery is ever more than seconds old.
      toleranceSeconds: 60,
    });
    // Read loosely: the payload shape is documented, but a ping must never be
    // the reason a valid delivery fails.
    subject = (event as unknown as { data?: { subject?: ContentSubject } })
      .data?.subject;
  } catch (err) {
    if (err instanceof CmssyWebhookError) {
      console.warn("revalidate: rejected webhook", {
        webhookId,
        reason: err.message,
      });
      return NextResponse.json({ revalidated: false }, { status: 401 });
    }
    console.error("revalidate: verification failed", { webhookId }, err);
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }

  // The nav, the site config and the page list are cached under one tag, so a
  // publish has to clear it too - otherwise a new page is live but missing
  // from every sidebar until the hourly window rolls over.
  // `expire: 0` - the tag is stale immediately, which is the point of a
  // publish webhook.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");

  // Tell IndexNow which URLs moved, after the response: cmssy gives up on a
  // delivery after 15 s and retries a slow one, and a ping is never worth a
  // retry storm. Production only - a preview deploy must not announce its
  // URLs, and there the key is unset anyway.
  const key = indexNowKey();
  const base = siteUrl();
  if (key && base && process.env.VERCEL_ENV === "production") {
    after(async () => {
      const urls = urlsForSubject(subject, await resolveSiteLocales(), base);
      await submitToIndexNow(urls, key, base);
    });
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
