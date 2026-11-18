import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { cmssy } from "@/cmssy/config";
import {
  PublicPageCoverDocument,
  PublicPageMetaDocument,
} from "@/graphql/generated/graphql";
import {
  localizedPath,
  pickLocalized,
  splitLocaleFromPath,
} from "@/lib/locale-path";
import { publicRequest } from "@/services/gateway";
import { siteUrl } from "@/lib/site-url";
import { coverUrl } from "@/lib/cover-url";
import { CONTENT_TAG } from "@/services/pages";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";

/**
 * Both reads are cached across renders under the content tag, like the rest of
 * the delivery reads: uncached, they are two requests per page at build, and
 * the limit is per IP. A failure is thrown inside the cache so it is not stored
 * for the hour; it degrades to "no meta" outside it.
 */
function cachedPageRead<T>(
  key: string,
  read: (slug: string) => Promise<T>,
): (slug: string) => Promise<T | null> {
  return cache(async (slug: string) => {
    try {
      return await unstable_cache(() => read(slug), [key, slug], {
        tags: [CONTENT_TAG],
        revalidate: 3600,
      })();
    } catch (error) {
      console.error(`[cmssy-web] ${key} of ${slug} could not be fetched`, error);
      return null;
    }
  });
}

const fetchPageMeta = cachedPageRead("cmssy-page-meta", (slug) =>
  publicRequest(
    PublicPageMetaDocument,
    { workspaceSlug: cmssy.workspaceSlug, slug },
    "page meta",
  ),
);

const fetchPageCover = cachedPageRead("cmssy-page-cover", (slug) =>
  publicRequest(
    PublicPageCoverDocument,
    { workspaceSlug: cmssy.workspaceSlug, slug },
    "page cover",
  ),
);

export async function buildPageMetadata(path?: string[]): Promise<Metadata> {
  const [config, { defaultLocale, locales }] = await Promise.all([
    fetchSiteConfig(),
    resolveSiteLocales(),
  ]);
  const { locale, path: strippedPath } = splitLocaleFromPath(path, {
    defaultLocale,
    locales,
  });
  const slug = "/" + (strippedPath ?? []).join("/");

  const [data, coverData] = await Promise.all([
    fetchPageMeta(slug),
    fetchPageCover(slug),
  ]);
  const meta = data?.public.page.get ?? null;

  const siteName =
    pickLocalized(config?.siteName, locale, defaultLocale) ||
    config?.branding?.brandName ||
    undefined;
  const title =
    pickLocalized(meta?.seoTitle, locale, defaultLocale) ||
    pickLocalized(meta?.displayName, locale, defaultLocale) ||
    siteName;
  const description =
    pickLocalized(meta?.seoDescription, locale, defaultLocale) || undefined;
  const keywords =
    meta?.seoKeywords && meta.seoKeywords.length > 0
      ? meta.seoKeywords
      : undefined;
  // A post shares with its own cover; every other page with the site default.
  const image =
    coverUrl(coverData?.public.page.get?.customFields) ??
    config?.branding?.ogImageUrl ??
    undefined;

  const canonical = `${siteUrl()}${localizedPath(slug, locale, defaultLocale)}`;
  const languages =
    locales.length > 1
      ? {
          ...Object.fromEntries(
            locales.map((l) => [
              l,
              `${siteUrl()}${localizedPath(slug, l, defaultLocale)}`,
            ]),
          ),
          "x-default": `${siteUrl()}${localizedPath(slug, defaultLocale, defaultLocale)}`,
        }
      : undefined;

  const base = siteUrl();

  return {
    // Relative URLs stay relative when the origin is unknown, instead of
    // resolving against a domain that is not ours.
    ...(base ? { metadataBase: new URL(base) } : {}),
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: canonical,
      ...(siteName ? { siteName } : {}),
      type: "website",
      locale,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(image ? { images: [image] } : {}),
    },
  };
}
