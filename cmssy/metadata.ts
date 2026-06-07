import type { Metadata } from "next";
import { graphqlRequest, normalizeSlug } from "@cmssy/react";
import { cmssy } from "./config";

const PUBLIC_PAGE_META_QUERY = `query PublicPageMeta($workspaceSlug: String!, $slug: String!) {
  publicPage(workspaceSlug: $workspaceSlug, slug: $slug) {
    id
    seoTitle
    seoDescription
    seoKeywords
    displayName
  }
}`;

const PUBLIC_SITE_BRANDING_QUERY = `query PublicSiteBranding($workspaceSlug: String!) {
  publicSiteConfig(workspaceSlug: $workspaceSlug) {
    branding {
      faviconUrl
      ogImageUrl
    }
  }
}`;

type Localized = Record<string, string> | string | null | undefined;

interface PageMeta {
  id: string;
  seoTitle: Localized;
  seoDescription: Localized;
  seoKeywords: string[] | null;
  displayName: Localized;
}

interface SiteBranding {
  faviconUrl: string | null;
  ogImageUrl: string | null;
}

function pick(value: Localized, locale: string, fallbackLocale = "en"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return (
    value[locale] || value[fallbackLocale] || Object.values(value)[0] || ""
  );
}

/**
 * Per-page SEO. The SDK's page fetch drops SEO fields, so we query publicPage
 * directly for metadata. `path` is the route catch-all segments (locale prefix
 * already stripped by the route tree); locale comes from resolveLocale.
 */
export async function buildPageMetadata(
  path: string[] | undefined,
): Promise<Metadata> {
  const locale = (await cmssy.resolveLocale?.()) ?? cmssy.defaultLocale ?? "en";
  const slug = normalizeSlug(path);

  let page: PageMeta | null = null;
  try {
    const data = await graphqlRequest<{ publicPage: PageMeta | null }>(
      { apiUrl: cmssy.apiUrl, workspaceSlug: cmssy.workspaceSlug },
      PUBLIC_PAGE_META_QUERY,
      { workspaceSlug: cmssy.workspaceSlug, slug },
      undefined,
      "page meta",
    );
    page = data.publicPage;
  } catch {
    page = null;
  }

  if (!page) return {};

  const title = pick(page.seoTitle, locale) || pick(page.displayName, locale);
  const description = pick(page.seoDescription, locale);
  const keywords = page.seoKeywords?.length ? page.seoKeywords : undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(keywords ? { keywords } : {}),
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      locale,
    },
  };
}

/**
 * Site-wide branding metadata (favicon, default OG image) from workspace
 * branding settings. Applied in the root layout so it covers every page;
 * per-page metadata still overrides title/description. Degrades to {} if the
 * config can't be fetched, so a backend without the branding field is safe.
 */
export async function buildSiteMetadata(): Promise<Metadata> {
  let branding: SiteBranding | null = null;
  try {
    const data = await graphqlRequest<{
      publicSiteConfig: { branding: SiteBranding | null } | null;
    }>(
      { apiUrl: cmssy.apiUrl, workspaceSlug: cmssy.workspaceSlug },
      PUBLIC_SITE_BRANDING_QUERY,
      { workspaceSlug: cmssy.workspaceSlug },
      undefined,
      "site branding",
    );
    branding = data.publicSiteConfig?.branding ?? null;
  } catch {
    branding = null;
  }

  if (!branding) return {};

  return {
    ...(branding.faviconUrl ? { icons: { icon: branding.faviconUrl } } : {}),
    ...(branding.ogImageUrl
      ? { openGraph: { images: [{ url: branding.ogImageUrl }] } }
      : {}),
  };
}
