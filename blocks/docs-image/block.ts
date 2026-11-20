import { defineBlock, fields } from "@cmssy/react";
import DocsImage from "./DocsImage";

export const docsImageProps = {
  src: fields.media({ label: "Image", required: true }),
  alt: fields.text({ label: "Alt Text", required: true }),
  caption: fields.text({ label: "Caption" }),
  width: fields.select({
    label: "Width",
options: ["small", "medium", "large", "full"],
    tab: "style",
  }),
  border: fields.boolean({
    label: "Show Border",
tab: "style",
  }),
  rounded: fields.boolean({
    label: "Rounded Corners",
tab: "style",
  }),
  shadow: fields.boolean({
    label: "Shadow",
tab: "style",
  }),
  zoomable: fields.boolean({ label: "Click to Zoom" }),
};

export const docsImageBlock = defineBlock({
  type: "docs-image",
  category: "Docs",
  label: "Docs Image",
  description: "Captioned image or figure for documentation content.",
  component: DocsImage,
  props: docsImageProps,
});
