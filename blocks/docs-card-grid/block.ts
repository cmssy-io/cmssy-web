import { defineBlock, fields } from "@cmssy/react";
import DocsCardGrid from "./DocsCardGrid";

export const docsCardGridProps = {
  fig: fields.text({
    label: "FIG Number",
    placeholder: "e.g., 1.0",
    localized: false,
  }),
  eyebrow: fields.text({ label: "Eyebrow", placeholder: "e.g., Start here" }),
  heading: fields.text({ label: "Section Heading" }),
  description: fields.textarea({ label: "Section Description" }),
  columns: fields.select({
    label: "Columns",
    defaultValue: "3",
    options: ["2", "3", "4"],
    tab: "style",
  }),
  band: fields.select({
    label: "Band",
    defaultValue: "paper",
    options: ["paper", "muted", "ink"],
    tab: "style",
  }),
  cards: fields.repeater({
    label: "Cards",
    itemSchema: {
      icon: fields.text({
        label: "Icon Name",
        placeholder: "e.g., Rocket, Code, Book",
        helperText: "Kept for existing content; the current card design does not show icons.",
      }),
      title: fields.text({ label: "Title", required: true }),
      description: fields.textarea({ label: "Description" }),
      url: fields.link({ label: "URL", required: true }),
    },
  }),
};

export const docsCardGridBlock = defineBlock({
  type: "docs-card-grid",
  category: "Docs",
  label: "Docs Card Grid",
  description:
    "Grid of navigational cards linking to docs sections; for a docs landing page.",
  component: DocsCardGrid,
  props: docsCardGridProps,
});
