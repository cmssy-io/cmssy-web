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

/** A published child page, in the order the CMS tree puts it. */
export type ChildPage = {
  id: string;
  fullSlug: string;
  pageType?: string | null;
  displayName?: Record<string, string> | string | null;
  seoDescription?: Record<string, string> | string | null;
};

const PAGES_BY_TYPE_QUERY = print(PublicPagesByTypeDocument);

/**
 * Direct children of a slug, ordered as in the page tree. `queryScoped` fills
 * in the workspace id, so this needs no id of its own.
 *
 * A failure degrades to an empty list - a section without a sidebar still
 * reads - but it is logged: a silently empty nav looks like a content problem
 * and sends whoever debugs it to the CMS instead of the delivery API.
 */
export async function listChildPages(
  parentSlug: string,
  limit = 100,
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
