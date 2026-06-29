"use client";

import type { PlatformContext } from "@cmssy/types";
import { Container } from "../../../components/container";
import type { BlockContent } from "./block";
import { EmptyDocIcon, SearchIcon } from "./icons";
import { PlaceholderCard, PostCard } from "./PostCard";
import { useBlogPosts } from "./useBlogPosts";

interface Props {
  content: BlockContent;
  context?: PlatformContext;
}

export default function BlogPosts({ content, context }: Props) {
  const {
    badge,
    heading,
    description,
    showSearch = true,
    searchPlaceholder = "Search posts...",
    loadingText = "Loading...",
    noResultsText = "No posts found",
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
  } = useBlogPosts(content, context);

  const hasHeader = badge || heading || description;
  const hasFilters = showSearch || categories.length > 0;
  const showPlaceholders = loading && items.length === 0;
  const showNoResults = filteredItems.length === 0 && !loading;
  const showSentinel =
    !isPreview && hasMore && !debouncedSearch && !activeCategory;

  return (
    <section className="py-24">
      <Container>
        {hasHeader && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            {badge && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-violet-600 bg-violet-100 px-3 py-1 rounded-full mb-4">
                {badge}
              </span>
            )}
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">{heading}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {hasFilters && (
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            {showSearch && (
              <div className="relative w-full sm:w-80">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => !isPreview && setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  readOnly={isPreview}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isPreview ? "opacity-60 cursor-not-allowed" : ""}`}
                />
              </div>
            )}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    !activeCategory
                      ? "bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-violet-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
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
            <EmptyDocIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{noResultsText}</p>
            {isPreview && parentSlug && (
              <p className="text-xs text-muted-foreground/60 mt-2">
                Add child pages to {parentSlug}
              </p>
            )}
          </div>
        )}

        {showSentinel && (
          <div ref={sentinelRef} className="flex justify-center py-10">
            {loading && (
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
