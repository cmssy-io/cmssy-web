import { cache } from "react";
import { unstable_cache } from "next/cache";
import { cmssy } from "@/cmssy/config";
import {
  PublicSiteConfigDocument,
  type PublicSiteConfigQuery,
} from "@/graphql/generated/graphql";
import type { SiteLocales } from "@/lib/locale-path";
import { CONTENT_TAG } from "@/services/pages";
import { publicRequest } from "@/services/gateway";

export type SiteConfig = NonNullable<
  PublicSiteConfigQuery["public"]["siteConfig"]
>;

/**
 * Site config is asked for by the layout, the metadata and the sitemap on the
 * same render, and it only changes when the workspace settings do - so it is
 * deduped per render and cached across them, under the tag the publish webhook
 * clears (CMS-1052). A failed fetch is not cached: one bad request must not
 * pin the process to an unknown locale set.
 */
export const fetchSiteConfig = cache(
  (): Promise<SiteConfig | null> =>
    unstable_cache(fetchSiteConfigUncached, ["cmssy-site-config"], {
      tags: [CONTENT_TAG],
      revalidate: 3600,
    })(),
);

async function fetchSiteConfigUncached(): Promise<SiteConfig | null> {
  try {
    const data = await publicRequest(
      PublicSiteConfigDocument,
      { workspaceSlug: cmssy.workspaceSlug },
      "site config",
    );
    return data.public.siteConfig ?? null;
  } catch (error) {
    console.error("[cmssy-web] site config could not be fetched", error);
    return null;
  }
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
