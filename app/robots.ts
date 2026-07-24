import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cmssy.io";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cmssy-edit/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
