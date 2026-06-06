import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const blogPostHeroBlock = defineBlock({
  type: "blog-post-hero",
  label: "Blog Post Hero",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "coverImage": fields.media({ label: "Cover Image" }),
    "title": fields.singleLine({ label: "Title", placeholder: "Your blog post title", required: true }),
    "excerpt": fields.multiLine({ label: "Excerpt", placeholder: "A short summary of the post" }),
    "category": fields.singleLine({ label: "Category", placeholder: "e.g. Engineering, Design, Product" }),
    "author": fields.singleLine({ label: "Author", placeholder: "Author name" }),
    "authorAvatar": fields.media({ label: "Author Avatar" }),
    "date": fields.date({ label: "Publish Date" }),
    "readingTime": fields.numeric({ label: "Reading Time (minutes)", defaultValue: 5 }),
    "breadcrumbLabel": fields.singleLine({ label: "Breadcrumb Label", defaultValue: "Blog" }),
    "breadcrumbUrl": fields.link({ label: "Breadcrumb URL", defaultValue: "/blog" })
  },
});
