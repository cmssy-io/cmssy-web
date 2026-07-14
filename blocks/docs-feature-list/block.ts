import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsFeatureListProps = {
  heading: fields.text({
    label: "Heading",
    placeholder: "e.g., Kluczowe możliwości",
  }),
  description: fields.textarea({ label: "Description" }),
  icon: fields.select({
    label: "Default Icon",
    defaultValue: "CheckCircle2",
    options: ["CheckCircle2", "Check", "Sparkles", "Zap", "Star", "Circle"],
  }),
  iconColor: fields.select({
    label: "Icon Color",
    defaultValue: "violet",
    options: ["violet", "emerald", "blue", "amber", "foreground"],
  }),
  layout: fields.select({
    label: "Layout",
    defaultValue: "stacked",
    options: ["stacked", "grid-2"],
    tab: "style",
  }),
  items: fields.repeater({
    label: "Items",
    itemSchema: {
      title: fields.text({ label: "Title", required: true }),
      description: fields.textarea({ label: "Description" }),
      icon: fields.select({
        label: "Icon (override)",
        options: ["CheckCircle2", "Check", "Sparkles", "Zap", "Star", "Circle"],
      }),
    },
  }),
};

export const docsFeatureListBlock = defineBlock({
  type: "docs-feature-list",
  category: "Docs",
  label: "Docs Feature List",
  description:
    "List of features with icons and descriptions; within documentation or product pages.",
  component: Component,
  props: docsFeatureListProps,
});
