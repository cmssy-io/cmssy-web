import type { Metadata } from "next";
import { cmssy } from "@/cmssy/config";
import { PublicPageMetaDocument } from "@/graphql/generated/graphql";
import {
  localizedPath,
  pickLocalized,
  splitLocaleFromPath,
} from "@/lib/locale-path";
import { publicRequest } from "@/services/gateway";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cmssy.io";

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

  const data = await publicRequest(
    PublicPageMetaDocument,
    { workspaceSlug: cmssy.workspaceSlug, slug },
    "page meta",
  ).catch(() => null);
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
  const image = config?.branding?.ogImageUrl ?? undefined;

  const canonical = `${SITE_URL}${localizedPath(slug, locale, defaultLocale)}`;
  const languages =
    locales.length > 1
      ? {
          ...Object.fromEntries(
            locales.map((l) => [
              l,
              `${SITE_URL}${localizedPath(slug, l, defaultLocale)}`,
            ]),
          ),
          "x-default": `${SITE_URL}${localizedPath(slug, defaultLocale, defaultLocale)}`,
        }
      : undefined;

  return {
    metadataBase: new URL(SITE_URL),
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
