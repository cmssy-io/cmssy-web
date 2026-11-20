"use client";

import type { PlatformContext } from "@cmssy/types";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { blogPostsProps, BlogPostsData } from "../block";
import { FileText, Search } from "lucide-react";
import { PlaceholderCard, PostCard } from "./PostCard";
import { useBlogPosts } from "./useBlogPosts";

type BlockStyle = Pick<
  BlockProps<typeof blogPostsProps>["content"],
  "layout" | "columns"
>;

export default function BlogPosts({
  content,
  context,
  data,
  style = {},
}: BlockProps<typeof blogPostsProps, BlogPostsData | null>) {
  const {
    badge,
    heading,
    description,
    showSearch = true,
    searchPlaceholder,
    loadingText,
    noResultsText,
  } = content;

  const {
    language,
    isPreview,
    parentSlug,
    layout,
    gridCols,
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
    items,
  } = useBlogPosts(
    content,
    context as unknown as PlatformContext | undefined,
    data,
    style as BlockStyle,
  );

  const hasHeader = badge || heading || description;
  const hasFilters = showSearch || categories.length > 0;
  const showPlaceholders = loading && items.length === 0;
  const showNoResults = filteredItems.length === 0 && !loading;
  const showSentinel =
    !isPreview && hasMore && !debouncedSearch && !activeCategory;

  return (
    <section className="bg-background py-section">
      <Container>
        {hasHeader && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            {badge && (
              <div className="mb-4">
                <FigEyebrow fig="" label={badge} />
              </div>
            )}
            {heading && (
              <h2 className="mb-4 font-heading text-h2 font-semibold text-balance">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lead text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {hasFilters && (
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            {showSearch && (
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => !isPreview && setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  readOnly={isPreview}
                  className={`w-full rounded-lg border border-border bg-background py-2.5 pr-4 pl-10 text-sm focus:border-elektryk focus:ring-2 focus:ring-elektryk/20 focus:outline-none ${isPreview ? "cursor-not-allowed opacity-60" : ""}`}
                />
              </div>
            )}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    !activeCategory
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat ? null : cat)
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-8 ${layout === "list" ? "" : gridCols}`}
        >
          {showPlaceholders
            ? Array.from({ length: 3 }).map((_, i) => (
                <PlaceholderCard key={i} />
              ))
            : filteredItems.map((item) => (
                <PostCard
                  key={item.id}
                  item={item}
                  language={language}
                  layout={layout}
                />
              ))}
        </div>

        {showNoResults && (
          <div className="flex flex-col items-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            {noResultsText && (
              <p className="text-muted-foreground">{noResultsText}</p>
            )}
            {isPreview && parentSlug && (
              <p className="text-xs text-muted-foreground/60 mt-2">
                Add child pages to {parentSlug}
              </p>
            )}
          </div>
        )}

        {showSentinel && (
          <div ref={sentinelRef} className="flex justify-center py-10">
            {loading && loadingText && (
              <span className="text-sm text-muted-foreground animate-pulse">
                {loadingText}
              </span>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
