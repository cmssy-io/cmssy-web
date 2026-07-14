import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsCalloutProps = {
  type: fields.select({
    label: "Type",
    defaultValue: "info",
    required: true,
    options: ["info", "tip", "warning", "danger", "note"],
  }),
  style: fields.select({
    label: "Style",
    defaultValue: "card",
    options: ["card", "accent-border"],
    tab: "style",
  }),
  title: fields.text({ label: "Title", placeholder: "Optional title" }),
  content: fields.richText({ label: "Content", required: true }),
};

export const docsCalloutBlock = defineBlock({
  type: "docs-callout",
  category: "Docs",
  label: "Docs Callout",
  description:
    "Highlighted note, warning or tip callout; inline within documentation content.",
  component: Component,
  props: docsCalloutProps,
});
