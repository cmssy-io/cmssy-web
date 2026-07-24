import type { MetadataRoute } from "next";
import {
  getPages,
  getSiteConfig,
  localizedPath,
  siteLocales,
} from "@/cmssy/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cmssy.io";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [config, pages] = await Promise.all([getSiteConfig(), getPages()]);
  const { defaultLocale, locales } = siteLocales(config);

  return pages
    .filter((page) => page.publishedAt)
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
