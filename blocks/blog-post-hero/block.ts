import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const blogPostHeroProps = {
  coverImage: fields.media({ label: "Cover Image" }),
  title: fields.text({
    label: "Title",
    placeholder: "Your blog post title",
    required: true,
  }),
  excerpt: fields.textarea({
    label: "Excerpt",
    placeholder: "A short summary of the post",
  }),
  category: fields.text({
    label: "Category",
    placeholder: "e.g. Engineering, Design, Product",
  }),
  author: fields.text({ label: "Author", placeholder: "Author name" }),
  authorAvatar: fields.media({ label: "Author Avatar" }),
  date: fields.date({ label: "Publish Date" }),
  readingTime: fields.number({
    label: "Reading Time (minutes)",
    defaultValue: 5,
  }),
  breadcrumbLabel: fields.text({
    label: "Breadcrumb Label",
    defaultValue: "Blog",
  }),
  breadcrumbUrl: fields.link({
    label: "Breadcrumb URL",
    defaultValue: "/blog",
  }),
};

export const blogPostHeroBlock = defineBlock({
  type: "blog-post-hero",
  category: "Blog",
  label: "Blog Post Hero",
  description:
    "Title header for a single blog post (title, author, date, cover image); top of a post page.",
  component: Component,
  props: blogPostHeroProps,
});
