import { defineBlock, fields } from "@cmssy/react";
import DocsImage from "./DocsImage";

export const docsImageProps = {
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
};

export const docsImageBlock = defineBlock({
  type: "docs-image",
  category: "Docs",
  label: "Docs Image",
  description: "Captioned image or figure for documentation content.",
  component: DocsImage,
  props: docsImageProps,
});
