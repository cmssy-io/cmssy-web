import { createCmssyClient, DEFAULT_CMSSY_API_URL } from "@cmssy/core";
import type {
  CmssyLayoutGroup,
  CmssyPageData,
  CmssyPageSummary,
} from "@cmssy/react";
import { cmssy } from "./config";

const client = createCmssyClient(cmssy);

export interface SiteBranding {
  brandName: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  ogImageUrl: string | null;
}

export interface SiteConfig {
  siteName: string | null;
  defaultLanguage: string | null;
  enabledLanguages: string[] | null;
  notFoundPageId: string | null;
  branding: SiteBranding | null;
}

export interface SiteLocales {
  defaultLocale: string;
  locales: string[];
}

const SITE_CONFIG_QUERY = `query PublicSiteConfig($workspaceSlug: String!) {
  public {
    siteConfig(workspaceSlug: $workspaceSlug) {
      siteName
      defaultLanguage
      enabledLanguages
      notFoundPageId
      branding { brandName logoUrl faviconUrl ogImageUrl }
    }
  }
}`;

const PAGE_META_QUERY = `query PublicPageMeta($workspaceSlug: String!, $slug: String!) {
  public {
    page {
      get(workspaceSlug: $workspaceSlug, slug: $slug) {
        id
        seoTitle
        seoDescription
        seoKeywords
        displayName
      }
    }
  }
}`;

const PAGE_ID_QUERY = `query PublicPageId($workspaceSlug: String!, $slug: String!, $previewSecret: String) {
  public {
    page {
      get(workspaceSlug: $workspaceSlug, slug: $slug, previewSecret: $previewSecret) {
        id
      }
    }
  }
}`;

const PAGE_BY_ID_QUERY = `query PublicPageById($workspaceSlug: String!, $pageId: ID!) {
  public {
    page {
      getById(workspaceSlug: $workspaceSlug, pageId: $pageId) {
        id
        publishedBlocks { id type content style advanced }
      }
    }
  }
}`;

const PAGES_LIST_QUERY = `query PublicPages($workspaceSlug: String!) {
  public {
    page {
      list(workspaceSlug: $workspaceSlug) {
        id
        slug
        updatedAt
        publishedAt
      }
    }
  }
}`;

const LAYOUTS_QUERY = `query PublicPageLayouts($workspaceSlug: String!, $pageSlug: String!, $previewSecret: String) {
  public {
    page {
      layouts(workspaceSlug: $workspaceSlug, pageSlug: $pageSlug, previewSecret: $previewSecret) {
        position
        blocks { id type content style advanced order isActive }
        settings { desktopWidth mobileBehavior }
      }
    }
  }
}`;

type LocalizedValue = Record<string, string> | string | null;

export interface PageMeta {
  seoTitle: LocalizedValue;
  seoDescription: LocalizedValue;
  seoKeywords: string[] | null;
  displayName: LocalizedValue;
}

export function resolveApiUrl(): string {
  const explicit = cmssy.apiUrl?.trim();
  if (explicit) return explicit;
  const fromEnv = process.env.CMSSY_API_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_CMSSY_API_URL;
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const data = await client.query<{
      public: { siteConfig: SiteConfig | null } | null;
    }>(SITE_CONFIG_QUERY, { workspaceSlug: cmssy.workspaceSlug });
    return data.public?.siteConfig ?? null;
  } catch {
    return null;
  }
}

export function siteLocales(config: SiteConfig | null): SiteLocales {
  const defaultLocale = config?.defaultLanguage || "en";
  const enabled = config?.enabledLanguages ?? [];
  return {
    defaultLocale,
    locales: enabled.length > 0 ? enabled : [defaultLocale],
  };
}

export async function resolveSiteLocales(): Promise<SiteLocales> {
  return siteLocales(await getSiteConfig());
}

/**
 * Splits the active locale off the routed catch-all segments. The first segment
 * is the locale only when it is an enabled, non-default language; otherwise the
 * default language renders with no prefix and the path is unchanged.
 */
export function splitLocaleFromPath(
  path: string[] | undefined,
  locales: SiteLocales,
): { locale: string; path: string[] } {
  const segments = path ?? [];
  const first = segments[0];
  if (
    first &&
    first !== locales.defaultLocale &&
    locales.locales.includes(first)
  ) {
    return { locale: first, path: segments.slice(1) };
  }
  return { locale: locales.defaultLocale, path: segments };
}

function normalizeSlug(slug: string): string {
  if (slug === "/" || slug === "") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function localizedPath(
  slug: string,
  locale: string,
  defaultLocale: string,
): string {
  const normalized = normalizeSlug(slug);
  const base = normalized === "/" ? "" : normalized;
  return locale === defaultLocale ? base || "/" : `/${locale}${base}`;
}

export async function getPageMeta(slug: string): Promise<PageMeta | null> {
  try {
    const data = await client.query<{
      public: { page: { get: PageMeta | null } | null } | null;
    }>(PAGE_META_QUERY, { workspaceSlug: cmssy.workspaceSlug, slug });
    return data.public?.page?.get ?? null;
  } catch {
    return null;
  }
}

export async function getPageId(
  slug: string,
  previewSecret?: string,
): Promise<{ id: string } | null> {
  try {
    const data = await client.query<{
      public: { page: { get: { id: string } | null } | null } | null;
    }>(PAGE_ID_QUERY, {
      workspaceSlug: cmssy.workspaceSlug,
      slug,
      previewSecret,
    });
    return data.public?.page?.get ?? null;
  } catch {
    return null;
  }
}

export async function getPageById(
  pageId: string,
): Promise<CmssyPageData | null> {
  try {
    const data = await client.query<{
      public: {
        page: {
          getById: {
            id: string;
            publishedBlocks: CmssyPageData["blocks"];
          } | null;
        } | null;
      } | null;
    }>(PAGE_BY_ID_QUERY, { workspaceSlug: cmssy.workspaceSlug, pageId });
    const page = data.public?.page?.getById;
    if (!page) return null;
    return { id: page.id, blocks: page.publishedBlocks ?? [] };
  } catch {
    return null;
  }
}

export async function getPages(): Promise<CmssyPageSummary[]> {
  try {
    const data = await client.query<{
      public: { page: { list: CmssyPageSummary[] | null } | null } | null;
    }>(PAGES_LIST_QUERY, { workspaceSlug: cmssy.workspaceSlug });
    return data.public?.page?.list ?? [];
  } catch {
    return [];
  }
}

export async function getLayoutGroups(
  pageSlug: string,
  previewSecret?: string,
): Promise<CmssyLayoutGroup[]> {
  try {
    const data = await client.query<{
      public: { page: { layouts: CmssyLayoutGroup[] | null } | null } | null;
    }>(LAYOUTS_QUERY, {
      workspaceSlug: cmssy.workspaceSlug,
      pageSlug,
      previewSecret,
    });
    return data.public?.page?.layouts ?? [];
  } catch {
    return [];
  }
}
