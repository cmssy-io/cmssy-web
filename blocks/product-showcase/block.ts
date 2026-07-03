import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const productShowcaseBlock = defineBlock({
  type: "product-showcase",
  label: "Product Showcase",
  description:
    "Gallery of product screenshots with titles and captions; a mid-page showcase section on a marketing or home page.",
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
  }>,
  props: {
    badgeText: fields.singleLine({
      label: "Badge Text",
      placeholder: "Inside the product",
    }),
    heading: fields.singleLine({
      label: "Heading",
      defaultValue: "See what you get",
      required: true,
    }),
    headingHighlight: fields.singleLine({ label: "Heading Highlight" }),
    description: fields.multiLine({
      label: "Description",
      placeholder: "Short intro above the gallery",
    }),
    items: fields.repeater({
      label: "Screenshots",
      itemSchema: {
        image: fields.media({
          label: "Screenshot",
          placeholder: "Upload a screenshot",
        }),
        title: fields.singleLine({
          label: "Title",
          defaultValue: "Feature",
          required: true,
        }),
        caption: fields.multiLine({
          label: "Caption",
          placeholder: "What this screen shows",
        }),
      },
    }),
  },
});
