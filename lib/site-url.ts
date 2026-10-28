/**
 * The site's own public origin. It is the app's to know - the CMS stores
 * canonical slugs, never your host. Missing, it is reported once and the
 * absolute URLs simply do not get built, rather than pointing at someone
 * else's domain.
 */
let warned = false;
export function siteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (value) return value.replace(/\/+$/, "");
  if (!warned) {
    warned = true;
    console.error(
      "[cmssy-web] NEXT_PUBLIC_SITE_URL is not set: canonical URLs, hreflang alternates and the sitemap will be relative",
    );
  }
  return "";
}
