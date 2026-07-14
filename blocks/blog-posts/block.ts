import type { PageItem } from "@cmssy/types";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export interface BlogPostsData {
  items: PageItem[];
  hasMore: boolean;
}

export const blogPostsProps = {
  badge: fields.text({ label: "Badge", defaultValue: "Latest Posts" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "From the Blog",
  }),
  description: fields.textarea({ label: "Description" }),
  parentPage: fields.pageSelector({ label: "Parent Page", multiple: false }),
  postsPerPage: fields.select({
    label: "Posts per page",
    defaultValue: "9",
    options: ["3", "6", "9", "12"],
  }),
  showSearch: fields.boolean({ label: "Show Search", defaultValue: true }),
  layout: fields.select({
    label: "Layout",
    defaultValue: "grid",
    options: ["grid", "list"],
    tab: "style",
  }),
  columns: fields.select({
    label: "Columns",
    defaultValue: "3",
    options: ["2", "3"],
    tab: "style",
  }),
  searchPlaceholder: fields.text({
    label: "Search Placeholder",
    defaultValue: "Search posts...",
  }),
  loadingText: fields.text({
    label: "Loading Text",
    defaultValue: "Loading...",
  }),
  noResultsText: fields.text({
    label: "No Results Text",
    defaultValue: "No posts found",
  }),
};

export const blogPostsBlock = defineBlock({
  type: "blog-posts",
  category: "Blog",
  label: "Blog Posts",
  description:
    "Grid or list of blog post previews; for a blog index or a 'latest posts' section.",
  component: Component,
  loader: async ({ content }): Promise<BlogPostsData | null> => {
    const parentPage = content.parentPage;
    const parentSlug = parentPage?.[0]?.slug;
    if (!parentSlug) return null;

    const limit = Number(content.postsPerPage) || 9;
    const { loadPosts } = await import("./load-posts");
    return loadPosts({ parentSlug, limit, offset: 0 });
  },
  props: blogPostsProps,
});
