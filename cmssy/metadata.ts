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

type Localized = Record<string, string> | string | null | undefined;

interface PageMeta {
  id: string;
  seoTitle: Localized;
  seoDescription: Localized;
  seoKeywords: string[] | null;
  displayName: Localized;
}

function pick(value: Localized, locale: string, fallbackLocale = "en"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value[fallbackLocale] || Object.values(value)[0] || "";
}

/**
 * Per-page SEO. The SDK's page fetch drops SEO fields, so we query publicPage
 * directly for metadata. `path` is the route catch-all segments (locale prefix
 * already stripped by the route tree); locale comes from resolveLocale.
 */
export async function buildPageMetadata(
  path: string[] | undefined,
): Promise<Metadata> {
  const locale =
    (await cmssy.resolveLocale?.()) ?? cmssy.defaultLocale ?? "en";
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
