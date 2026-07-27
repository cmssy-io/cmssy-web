import { cache } from "react";
import { unstable_cache } from "next/cache";
import { print } from "graphql";
import { createCmssyClient } from "@cmssy/react";
import type { CmssyPageData, CmssyPageSummary } from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import {
  PublicPageByIdDocument,
  PublicPageIdDocument,
  PublicPagesByTypeDocument,
  PublicPagesDocument,
} from "@/graphql/generated/graphql";
import { publicRequest } from "@/services/gateway";
import type { PageCustomField } from "@/lib/docs-ui";

/** A published child page, in the order the CMS tree puts it. */
export type ChildPage = {
  id: string;
  fullSlug: string;
  pageType?: string | null;
  displayName?: Record<string, string> | string | null;
  seoDescription?: Record<string, string> | string | null;
  /** A section root carries the shell's own copy here (see lib/docs-ui.ts). */
  customFields?: PageCustomField[] | null;
};

const PAGES_BY_TYPE_QUERY = print(PublicPagesByTypeDocument);

/** One tag for everything the CMS can change; the publish webhook clears it. */
export const CONTENT_TAG = "cmssy-content";

/**
 * Direct children of a slug, ordered as in the page tree. `queryScoped` fills
 * in the workspace id, so this needs no id of its own.
 *
 * Cached twice on purpose. `cache` dedupes within one render - the nav is
 * asked for the same section by the page and its metadata - and
 * `unstable_cache` keeps it across renders, because the delivery API allows
 * 100 requests a minute per IP and a serverless region shares one. A cold
 * docs page used to fan out a dozen queries; a burst of them is what turned
 * into 429s and 500-ed the page (CMS-1052).
 *
 * A failure degrades to an empty list - a section without a sidebar still
 * reads - but it is logged: a silently empty nav looks like a content problem
 * and sends whoever debugs it to the CMS instead of the delivery API.
 */
export const listChildPages = cache(
  (parentSlug: string, limit = 100): Promise<ChildPage[]> =>
    unstable_cache(
      () => fetchChildPages(parentSlug, limit),
      ["cmssy-child-pages", parentSlug, String(limit)],
      { tags: [CONTENT_TAG], revalidate: 3600 },
    )(),
);

async function fetchChildPages(
  parentSlug: string,
  limit: number,
): Promise<ChildPage[]> {
  try {
    const data = await createCmssyClient(cmssy).queryScoped<{
      public?: {
        page?: { byType?: { items?: ChildPage[] } | null } | null;
      } | null;
    }>(PAGES_BY_TYPE_QUERY, { parentSlug, limit, sortBy: "order_asc" });
    return data?.public?.page?.byType?.items ?? [];
  } catch (error) {
    console.error(
      `[cmssy-web] child pages of ${parentSlug} could not be fetched`,
      error,
    );
    return [];
  }
}

export async function listPublicPages(): Promise<CmssyPageSummary[]> {
  try {
    const data = await publicRequest(
      PublicPagesDocument,
      { workspaceSlug: cmssy.workspaceSlug },
      "public pages",
    );
    return data.public.page.list;
  } catch {
    return [];
  }
}

/**
 * The paths to prerender.
 *
 * Deliberately not `listPublicPages`: that one degrades to an empty list, which
 * a sitemap survives and this does not. Zero params means the catch-all is
 * served on demand and cached by nothing - with a green build, a blank
 * Revalidate column, and no other warning. That is how every route on this site
 * ran uncached through all of v10. Let the build fail instead.
 */
export async function publishedPaths(): Promise<{ path: string[] }[]> {
  const data = await publicRequest(
    PublicPagesDocument,
    { workspaceSlug: cmssy.workspaceSlug },
    "published paths",
  );

  return data.public.page.list
    .filter((page) => page.publishedAt)
    .map((page) => ({ path: (page.slug ?? "").split("/").filter(Boolean) }));
}

export async function getPageById(
  pageId: string,
): Promise<CmssyPageData | null> {
  try {
    const data = await publicRequest(
      PublicPageByIdDocument,
      { workspaceSlug: cmssy.workspaceSlug, pageId },
      "page by id",
    );
    const page = data.public.page.getById;
    if (!page) return null;
    return { id: page.id, blocks: page.publishedBlocks };
  } catch {
    return null;
  }
}

export async function getPageId(
  slug: string,
  previewSecret?: string,
): Promise<{ id: string } | null> {
  try {
    const data = await publicRequest(
      PublicPageIdDocument,
      {
        workspaceSlug: cmssy.workspaceSlug,
        slug,
        previewSecret: previewSecret ?? null,
      },
      "page id",
    );
    return data.public.page.get ?? null;
  } catch {
    return null;
  }
}
