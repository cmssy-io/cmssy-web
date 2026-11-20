import type { PageItem } from "@cmssy/types";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src/BlogPosts";
import { pageSelectorSlug, postsSortVars } from "./src/utils";

export interface BlogPostsData {
  items: PageItem[];
  hasMore: boolean;
}

export const blogPostsProps = {
  badge: fields.text({ label: "Badge" }),
  heading: fields.text({
    label: "Heading",
  }),
  description: fields.textarea({ label: "Description" }),
  parentPage: fields.pageSelector({ label: "Parent Page", multiple: false }),
  postsPerPage: fields.select({
    label: "Posts per page",
options: ["3", "6", "9", "12"],
  }),
  sortPageType: fields.text({ label: "Sort: post page type" }),
  sortField: fields.text({ label: "Sort: date field, newest first" }),
  showSearch: fields.boolean({ label: "Show Search" }),
  layout: fields.select({
    label: "Layout",
options: ["grid", "list"],
    tab: "style",
  }),
  columns: fields.select({
    label: "Columns",
options: ["2", "3"],
    tab: "style",
  }),
  searchPlaceholder: fields.text({
    label: "Search Placeholder",
  }),
  loadingText: fields.text({
    label: "Loading Text",
  }),
  noResultsText: fields.text({
    label: "No Results Text",
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
    const parentSlug = pageSelectorSlug(content.parentPage);
    if (!parentSlug) return null;

    const limit = Number(content.postsPerPage) || 9;
    const { loadPosts } = await import("./load-posts");
    return loadPosts({
      parentSlug,
      limit,
      offset: 0,
      ...postsSortVars(content),
    });
  },
  props: blogPostsProps,
});
