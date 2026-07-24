import type { Metadata } from "next";
import { graphqlRequest } from "@cmssy/react";
import { cmssy } from "./config";
import {
  getPageMeta,
  getSiteConfig,
  localizedPath,
  siteLocales,
  splitLocaleFromPath,
} from "./site";

type LocalizedValue = Record<string, string> | string | null;

function pick(
  value: LocalizedValue | undefined,
  locale: string,
  defaultLocale: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value[defaultLocale] || Object.values(value)[0] || "";
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cmssy.io";
const SITE_NAME = "Cmssy";
const SITE_DESCRIPTION =
  "Cmssy is a headless CMS with a visual block editor, AI tools, and an MCP server. Build your content in Cmssy and render it on your own frontend via the API.";
const TWITTER_HANDLE = "@cmssy_io";

const PUBLIC_SITE_BRANDING_QUERY = `query PublicSiteBranding {
  public {
    siteConfig {
      branding {
        faviconUrl
        ogImageUrl
      }
    }
  }
}`;

interface SiteBranding {
  faviconUrl: string | null;
  ogImageUrl: string | null;
}

export async function buildSiteMetadata(): Promise<Metadata> {
  let branding: SiteBranding | null = null;
  try {
    const data = await graphqlRequest<{
      public: { siteConfig: { branding: SiteBranding | null } | null } | null;
    }>(
      {
        apiUrl: cmssy.apiUrl,
        org: cmssy.org,
        workspaceSlug: cmssy.workspaceSlug,
      },
      PUBLIC_SITE_BRANDING_QUERY,
      {},
      undefined,
      "site branding",
    );
    branding = data.public?.siteConfig?.branding ?? null;
  } catch {
    branding = null;
  }

  const ogImages = branding?.ogImageUrl
    ? [{ url: branding.ogImageUrl }]
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    icons: branding?.faviconUrl ? { icon: branding.faviconUrl } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: branding?.ogImageUrl ? [branding.ogImageUrl] : undefined,
    },
  };
}

/**
 * Per-page Metadata for the catch-all route. The active locale is read from the
 * routed segments (the URL prefix is what says which language this page is),
 * SEO fields come from the delivery API's page.get, and canonical + hreflang
 * alternates are derived from the enabled languages.
 */
export async function buildPageMetadata(path?: string[]): Promise<Metadata> {
  const config = await getSiteConfig();
  const { defaultLocale, locales } = siteLocales(config);
  const { locale, path: strippedPath } = splitLocaleFromPath(path, {
    defaultLocale,
    locales,
  });
  const slug = "/" + (strippedPath ?? []).join("/");

  const meta = await getPageMeta(slug);

  const siteName =
    pick(config?.siteName, locale, defaultLocale) ||
    config?.branding?.brandName ||
    SITE_NAME;
  const title =
    pick(meta?.seoTitle, locale, defaultLocale) ||
    pick(meta?.displayName, locale, defaultLocale) ||
    siteName;
  const description = pick(meta?.seoDescription, locale, defaultLocale);
  const keywords = meta?.seoKeywords?.length ? meta.seoKeywords : undefined;
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
      siteName,
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
