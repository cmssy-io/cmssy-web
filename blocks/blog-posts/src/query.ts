export const PUBLIC_PAGES_QUERY = `query PublicPagesByType($workspaceId: String!, $parentSlug: String, $search: String, $limit: Int, $offset: Int) {
  public {
    page {
      byType(workspaceId: $workspaceId, parentSlug: $parentSlug, search: $search, limit: $limit, offset: $offset) {
        items { id slug fullSlug publishedAt displayName seoTitle seoDescription customFields pageType }
        total hasMore
      }
    }
  }
}`;
