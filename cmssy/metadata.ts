import type { Metadata } from "next";
import { graphqlRequest } from "@cmssy/react";
import { cmssy } from "./config";

const PUBLIC_SITE_BRANDING_QUERY = `query PublicSiteBranding($workspaceSlug: String!) {
  publicSiteConfig(workspaceSlug: $workspaceSlug) {
    branding {
      faviconUrl
    }
  }
}`;

interface SiteBranding {
  faviconUrl: string | null;
}

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

  if (!branding?.faviconUrl) return {};

  return { icons: { icon: branding.faviconUrl } };
}
