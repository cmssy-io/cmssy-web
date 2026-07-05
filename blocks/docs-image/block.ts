import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsImageBlock = defineBlock({
  type: "docs-image",
  category: "Docs",
  label: "Docs Image",
  description: "Captioned image or figure for documentation content.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
  }>,
  props: {
    src: fields.media({ label: "Image", required: true }),
    alt: fields.text({ label: "Alt Text", required: true }),
    caption: fields.text({ label: "Caption" }),
    width: fields.select({
      label: "Width",
      defaultValue: "large",
      options: ["small", "medium", "large", "full"],
      tab: "style",
    }),
    border: fields.boolean({
      label: "Show Border",
      defaultValue: true,
      tab: "style",
    }),
    rounded: fields.boolean({
      label: "Rounded Corners",
      defaultValue: true,
      tab: "style",
    }),
    shadow: fields.boolean({
      label: "Shadow",
      defaultValue: true,
      tab: "style",
    }),
    zoomable: fields.boolean({ label: "Click to Zoom", defaultValue: true }),
  },
});
