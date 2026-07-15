import { defineBlock, fields } from "@cmssy/react";
import Image from "./Image";

export const imageProps = {
  src: fields.media({ label: "Image", required: true }),
  alt: fields.text({
    label: "Alt Text",
    helperText: "Describe the image for accessibility",
  }),
  caption: fields.text({ label: "Caption" }),
  width: fields.select({
    label: "Width",
    defaultValue: "full",
    options: ["small", "medium", "large", "full"],
    tab: "style",
  }),
  rounded: fields.boolean({
    label: "Rounded Corners",
    defaultValue: true,
    tab: "style",
  }),
};

export const imageBlock = defineBlock({
  type: "image",
  category: "Media",
  label: "Image",
  description: "Standalone image or figure; anywhere content needs a visual.",
  component: Image,
  props: imageProps,
});
