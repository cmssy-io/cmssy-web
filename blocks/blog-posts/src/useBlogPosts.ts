"use client";

import type { PageItem, PlatformContext } from "@cmssy/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BlogPostsData } from "../block";
import type { BlockContent } from "./block";
import { PUBLIC_PAGES_QUERY } from "./query";
import { getCustomField } from "./utils";

export function useBlogPosts(
  content: BlockContent,
  context?: PlatformContext,
  ssr?: BlogPostsData | null,
) {
  const { layout = "grid", columns = "3", parentPage, postsPerPage } = content;

  const parentSlug = Array.isArray(parentPage)
    ? parentPage[0]?.slug
    : typeof parentPage === "string"
      ? parentPage
      : undefined;

  const language = context?.locale?.current ?? "en";
  const pagesCollection = context?.pages?._default;
  const isPreview = context?.isPreview ?? false;
  const workspaceId =
    context?.workspace?.id ?? process.env.NEXT_PUBLIC_CMSSY_WORKSPACE_ID;

  const [items, setItems] = useState<PageItem[]>(
    pagesCollection?.items ?? ssr?.items ?? [],
  );
  const [hasMore, setHasMore] = useState(
    pagesCollection?.hasMore ?? ssr?.hasMore ?? false,
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const limit = Number(postsPerPage) || 9;
  const PREVIEW_LIMIT = 6;
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPages = useCallback(
    async (opts: { offset?: number; search?: string; limit?: number }) => {
      if (!workspaceId || !parentSlug) return null;
      const apiUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(`${apiUrl}/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: PUBLIC_PAGES_QUERY,
          variables: {
            workspaceId,
            parentSlug,
            search: opts.search || undefined,
            limit: opts.limit ?? limit,
            offset: opts.offset ?? 0,
          },
        }),
      });
      const json = await res.json();
      return json?.data?.publicPagesByType ?? null;
    },
    [workspaceId, parentSlug, limit],
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (isPreview || !debouncedSearch) {
      if (!debouncedSearch) {
        if (pagesCollection) {
          setItems(pagesCollection.items ?? []);
          setHasMore(pagesCollection.hasMore ?? false);
        } else if (ssr) {
          setItems(ssr.items);
          setHasMore(ssr.hasMore);
        }
      }
      return;
    }

    setLoading(true);
    fetchPages({ search: debouncedSearch, limit: 50 })
      .then((result) => {
        if (result) {
          setItems(result.items);
          setHasMore(false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch, isPreview, fetchPages, pagesCollection, ssr]);

  useEffect(() => {
    if (isPreview || pagesCollection || ssr || debouncedSearch) return;
    if (!workspaceId || !parentSlug) return;

    let active = true;
    setLoading(true);
    fetchPages({ offset: 0 })
      .then((result) => {
        if (active && result) {
          setItems(result.items);
          setHasMore(result.hasMore);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    isPreview,
    pagesCollection,
    ssr,
    debouncedSearch,
    workspaceId,
    parentSlug,
    fetchPages,
  ]);

  useEffect(() => {
    if (!isPreview || previewLoaded || !context?.workspace?.id || !parentSlug)
      return;

    setPreviewLoaded(true);
    setLoading(true);

    fetchPages({ limit: PREVIEW_LIMIT })
      .then((result) => {
        if (result) {
          setItems(result.items);
          setHasMore(false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isPreview, previewLoaded, context, parentSlug, fetchPages]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const item of items) {
      const cat = getCustomField(item, "category") as string | null;
      if (cat) cats.add(cat);
    }
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return items;
    return items.filter(
      (item) => getCustomField(item, "category") === activeCategory,
    );
  }, [items, activeCategory]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || debouncedSearch) return;
    setLoading(true);

    try {
      const result = await fetchPages({ offset: items.length });
      if (result) {
        setItems((prev) => [...prev, ...result.items]);
        setHasMore(result.hasMore);
      }
    } catch (err) {
      console.error("[BlogPosts] Load more failed:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, debouncedSearch, fetchPages, items.length]);

  useEffect(() => {
    if (isPreview || !hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isPreview, hasMore, loadMore]);

  const GRID_COLS_MAP: Record<string, string> = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-2 lg:grid-cols-3",
  };

  const gridCols =
    layout === "list" ? "" : (GRID_COLS_MAP[columns] ?? GRID_COLS_MAP["3"]);

  return {
    language,
    isPreview,
    parentSlug,
    layout,
    gridCols,
    items,
    filteredItems,
    loading,
    hasMore,
    search,
    setSearch,
    debouncedSearch,
    categories,
    activeCategory,
    setActiveCategory,
    sentinelRef,
  };
}
