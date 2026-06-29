import { createCmssyClient } from "@cmssy/react";
import type { PageItem } from "@cmssy/types";
import { cmssy } from "@/cmssy/config";
import { PUBLIC_PAGES_QUERY } from "./src/query";

const client = createCmssyClient(cmssy);

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
      publicPagesByType?: { items?: PageItem[]; hasMore?: boolean } | null;
    }>(PUBLIC_PAGES_QUERY, vars);
    const r = data?.publicPagesByType;
    return r ? { items: r.items ?? [], hasMore: !!r.hasMore } : null;
  } catch {
    return null;
  }
}
