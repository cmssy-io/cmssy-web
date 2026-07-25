import type { MetadataRoute } from "next";
import { localizedPath } from "@/lib/locale-path";
import { listPublicPages } from "@/services/pages";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cmssy.io";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ defaultLocale, locales }, pages, siteConfig] = await Promise.all([
    resolveSiteLocales(),
    listPublicPages(),
    fetchSiteConfig(),
  ]);

  // The 404 page is published like any other, so it reaches this list. Listing
  // it invites crawlers to index an error; the workspace already says which one
  // it is.
  const notFoundPageId = siteConfig?.notFoundPageId ?? null;

  return pages
    .filter((page) => page.publishedAt && page.id !== notFoundPageId)
    .map((page) => {
      const url = `${SITE_URL}${localizedPath(page.slug, defaultLocale, defaultLocale)}`;
      const lastModified = page.updatedAt ?? page.publishedAt ?? undefined;
      const languages =
        locales.length > 1
          ? Object.fromEntries(
              locales.map((locale) => [
                locale,
                `${SITE_URL}${localizedPath(page.slug, locale, defaultLocale)}`,
              ]),
            )
          : undefined;

      return {
        url,
        ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
        ...(languages ? { alternates: { languages } } : {}),
      };
    });
}
