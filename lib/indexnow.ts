import { localizedPath, type SiteLocales } from "@/lib/locale-path";

// IndexNow tells Bing (and the engines that share its feed) that a URL changed,
// instead of waiting for the next crawl. The key is ours to choose; the engine
// proves we own the host by fetching it back from KEY_PATH.
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const KEY_PATH = "/indexnow-key.txt";

// 8-128 characters of a-z, A-Z, 0-9 and "-", per the protocol.
const KEY_FORMAT = /^[A-Za-z0-9-]{8,128}$/;

export function indexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && KEY_FORMAT.test(key) ? key : null;
}

/** The subject a cmssy `content.changed` delivery carries. */
export interface ContentSubject {
  kind?: string;
  action?: string;
  slug?: string | null;
}

/**
 * The public URLs a page change touched, one per locale. Only a page with a
 * slug maps to a URL: records, media, models and settings either have no URL
 * of their own here or move the whole site, and pinging every URL on each of
 * those would read as spam to the engines. `created` is skipped because a new
 * page is a draft until it is published, which arrives as its own event.
 * An unpublished or deleted page is still sent: IndexNow is also how an
 * engine learns that a URL is gone.
 */
export function urlsForSubject(
  subject: ContentSubject | undefined,
  { defaultLocale, locales }: SiteLocales,
  base: string,
): string[] {
  if (!subject || subject.kind !== "page" || subject.action === "created") {
    return [];
  }
  const slug = subject.slug;
  if (typeof slug !== "string" || !base || locales.length === 0) return [];
  return locales.map(
    (locale) => `${base}${localizedPath(slug, locale, defaultLocale)}`,
  );
}

/**
 * Sends the URLs to IndexNow. Never throws: a failed ping costs us a faster
 * crawl, not a publish, so it is logged and dropped.
 */
export async function submitToIndexNow(
  urls: string[],
  key: string,
  base: string,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  if (urls.length === 0) return;
  try {
    const response = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(base).host,
        key,
        keyLocation: `${base}${KEY_PATH}`,
        urlList: urls,
      }),
    });
    // 200 and 202 both mean accepted; 202 is "key validation pending".
    if (!response.ok) {
      console.warn("indexnow: submission refused", {
        status: response.status,
        urls,
      });
    }
  } catch (err) {
    console.warn("indexnow: submission failed", { urls }, err);
  }
}
