import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsCardGridBlock = defineBlock({
  type: "docs-card-grid",
  label: "Docs Card Grid",
  description:
    "Grid of navigational cards linking to docs sections; for a docs landing page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
  }>,
  props: {
    heading: fields.text({ label: "Section Heading" }),
    description: fields.textarea({ label: "Section Description" }),
    columns: fields.select({
      label: "Columns",
      defaultValue: "3",
      options: ["2", "3", "4"],
      tab: "style",
    }),
    cards: fields.repeater({
      label: "Cards",
      itemSchema: {
        icon: fields.text({
          label: "Icon Name",
          placeholder: "e.g., Rocket, Code, Book",
        }),
        title: fields.text({ label: "Title", required: true }),
        description: fields.textarea({ label: "Description" }),
        url: fields.link({ label: "URL", required: true }),
      },
    }),
  },
});
