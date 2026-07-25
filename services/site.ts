import { cmssy } from "@/cmssy/config";
import {
  PublicSiteConfigDocument,
  type PublicSiteConfigQuery,
} from "@/graphql/generated/graphql";
import type { SiteLocales } from "@/lib/locale-path";
import { publicRequest } from "@/services/gateway";

export type SiteConfig = NonNullable<
  PublicSiteConfigQuery["public"]["siteConfig"]
>;

let cached: SiteConfig | null | undefined;

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  if (cached !== undefined) return cached;
  try {
    const data = await publicRequest(
      PublicSiteConfigDocument,
      { workspaceSlug: cmssy.workspaceSlug },
      "site config",
    );
    cached = data.public.siteConfig ?? null;
  } catch {
    return null;
  }
  return cached;
}

/**
 * The languages are the workspace's, never this repo's. When the config cannot
 * be read the answer is "unknown" - an empty set - not a guessed default: a
 * hardcoded "en" would silently serve an English-shaped site to every visitor
 * of a workspace whose default is something else.
 */
export async function resolveSiteLocales(): Promise<SiteLocales> {
  const config = await fetchSiteConfig();
  const defaultLocale = config?.defaultLanguage ?? "";
  const enabled = config?.enabledLanguages ?? [];
  return {
    defaultLocale,
    locales: enabled.length > 0 ? enabled : defaultLocale ? [defaultLocale] : [],
  };
}
