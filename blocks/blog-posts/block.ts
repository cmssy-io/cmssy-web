import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const blogPostsBlock = defineBlock({
  type: "blog-posts",
  label: "Blog Posts",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badge": fields.singleLine({ label: "Badge", defaultValue: "Latest Posts" }),
    "heading": fields.singleLine({ label: "Heading", defaultValue: "From the Blog" }),
    "description": fields.multiLine({ label: "Description" }),
    "parentPage": fields.link({ label: "Parent Page" }),
    "postsPerPage": fields.select({ label: "Posts per page", defaultValue: "9", options: ["3","6","9","12"] }),
    "showSearch": fields.boolean({ label: "Show Search", defaultValue: true }),
    "layout": fields.select({ label: "Layout", defaultValue: "grid", options: ["grid","list"] }),
    "columns": fields.select({ label: "Columns", defaultValue: "3", options: ["2","3"] }),
    "searchPlaceholder": fields.singleLine({ label: "Search Placeholder", defaultValue: "Search posts..." }),
    "loadingText": fields.singleLine({ label: "Loading Text", defaultValue: "Loading..." }),
    "noResultsText": fields.singleLine({ label: "No Results Text", defaultValue: "No posts found" })
  },
});
