import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { graphqlRequest } from "@cmssy/react";
import { cmssy, enabledLocales } from "@/cmssy/config";

export const dynamic = "force-dynamic";

const PUBLIC_PAGES_QUERY = `query PublicPagesForSitemap($workspaceSlug: String!) {
  publicPages(workspaceSlug: $workspaceSlug) {
    slug
    updatedAt
    publishedAt
  }
}`;

const RESERVED_SLUGS = new Set(["/not-found", "/404"]);

interface SitemapPage {
  slug: string;
  updatedAt: string | null;
  publishedAt: string | null;
}

function localizedPath(slug: string, locale: string): string {
  const normalized =
    slug === "/" ? "" : slug.startsWith("/") ? slug : `/${slug}`;
  return locale === cmssy.defaultLocale
    ? normalized || "/"
    : `/${locale}${normalized}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") ?? "cmssy.com";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let pages: SitemapPage[] = [];
  try {
    const data = await graphqlRequest<{ publicPages: SitemapPage[] }>(
      { apiUrl: cmssy.apiUrl, workspaceSlug: cmssy.workspaceSlug },
      PUBLIC_PAGES_QUERY,
      { workspaceSlug: cmssy.workspaceSlug },
      undefined,
      "sitemap pages",
    );
    pages = data.publicPages ?? [];
  } catch {
    pages = [];
  }

  return pages
    .filter((page) => !RESERVED_SLUGS.has(page.slug))
    .map((page) => {
      const lastModified = page.updatedAt ?? page.publishedAt ?? undefined;
      return {
        url: `${baseUrl}${localizedPath(page.slug, cmssy.defaultLocale ?? "en")}`,
        ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
        alternates: {
          languages: Object.fromEntries(
            enabledLocales.map((locale) => [
              locale,
              `${baseUrl}${localizedPath(page.slug, locale)}`,
            ]),
          ),
        },
      };
    });
}
