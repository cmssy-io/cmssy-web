import type { Metadata } from "next";
import { graphqlRequest } from "@cmssy/react";
import { cmssy } from "./config";

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
