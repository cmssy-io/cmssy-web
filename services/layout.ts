import type { CmssyLayoutGroup } from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import { PublicPageLayoutsDocument } from "@/graphql/generated/graphql";
import { publicRequest } from "@/services/gateway";

export async function fetchChromeLayouts(
  pageSlug: string,
  previewSecret?: string,
): Promise<CmssyLayoutGroup[]> {
  try {
    const data = await publicRequest(
      PublicPageLayoutsDocument,
      {
        workspaceSlug: cmssy.workspaceSlug,
        pageSlug,
        previewSecret: previewSecret ?? null,
      },
      "page layouts",
    );
    return data.public.page.layouts;
  } catch {
    return [];
  }
}
