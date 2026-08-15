import { print } from "graphql";
import { createCmssyClient } from "@cmssy/react";
import type { PageItem } from "@cmssy/types";
import { cmssy } from "@/cmssy/config";
import { PublicPagesByTypeDocument } from "@/graphql/generated/graphql";

const client = createCmssyClient(cmssy);
const PUBLIC_PAGES_QUERY = print(PublicPagesByTypeDocument);

export type LoadPostsVars = {
  parentSlug: string;
  limit: number;
  offset?: number;
};

export type PostsResult = {
  items: PageItem[];
  hasMore: boolean;
};

export async function loadPosts(
  vars: LoadPostsVars,
): Promise<PostsResult | null> {
  if (typeof window !== "undefined") {
    throw new Error("[cmssy-web] loadPosts must only run on the server");
  }
  try {
    const data = await client.queryScoped<{
      public?: {
        page?: {
          byType?: { items?: PageItem[]; hasMore?: boolean } | null;
        } | null;
      } | null;
    }>(PUBLIC_PAGES_QUERY, vars);
    const r = data?.public?.page?.byType;
    if (!r) {
      console.error(
        "[cmssy-web] loadPosts: the delivery read returned nothing",
      );
      return null;
    }
    return { items: r.items ?? [], hasMore: !!r.hasMore };
  } catch (err) {
    console.error("[cmssy-web] loadPosts failed", err);
    return null;
  }
}
