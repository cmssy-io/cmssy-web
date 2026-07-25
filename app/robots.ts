import type { MetadataRoute } from "next";
import { siteUrl } from "@/services/seo";


export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cmssy-edit/", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
