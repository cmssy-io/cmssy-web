import type { CmssyPageData, CmssyPageSummary } from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import {
  PublicPageByIdDocument,
  PublicPageIdDocument,
  PublicPagesDocument,
} from "@/graphql/generated/graphql";
import { publicRequest } from "@/services/gateway";

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
