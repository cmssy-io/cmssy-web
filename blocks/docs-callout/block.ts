import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsCalloutBlock = defineBlock({
  type: "docs-callout",
  category: "Docs",
  label: "Docs Callout",
  description:
    "Highlighted note, warning or tip callout; inline within documentation content.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
  }>,
  props: {
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
  },
});
