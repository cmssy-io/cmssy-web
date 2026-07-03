import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const imageBlock = defineBlock({
  type: "image",
  label: "Image",
  description: "Standalone image or figure; anywhere content needs a visual.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "src": fields.media({ label: "Image", required: true }),
    "alt": fields.singleLine({ label: "Alt Text", helperText: "Describe the image for accessibility" }),
    "caption": fields.singleLine({ label: "Caption" }),
    "width": fields.select({ label: "Width", defaultValue: "full", options: ["small","medium","large","full"] }),
    "rounded": fields.boolean({ label: "Rounded Corners", defaultValue: true })
  },
});
