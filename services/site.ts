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

export async function resolveSiteLocales(): Promise<SiteLocales> {
  const config = await fetchSiteConfig();
  const defaultLocale = config?.defaultLanguage || "en";
  const enabled = config?.enabledLanguages ?? [];
  return {
    defaultLocale,
    locales: enabled.length > 0 ? enabled : [defaultLocale],
  };
}
