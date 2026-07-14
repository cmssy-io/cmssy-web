import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsHeroProps = {
  badge: fields.text({
    label: "Badge Text",
    placeholder: "e.g., Documentation",
  }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Documentation",
    required: true,
  }),
  description: fields.textarea({ label: "Description" }),
  variant: fields.select({
    label: "Variant",
    defaultValue: "default",
    options: ["default", "gradient", "minimal"],
    tab: "style",
  }),
  showSearch: fields.boolean({
    label: "Show Search Bar",
    defaultValue: true,
  }),
  searchPlaceholder: fields.text({
    label: "Search Placeholder",
    defaultValue: "Search documentation...",
  }),
  quickLinks: fields.repeater({
    label: "Quick Links",
    itemSchema: {
      icon: fields.text({
        label: "Icon Name",
        placeholder: "e.g., Rocket, Book, Code",
      }),
      title: fields.text({ label: "Title", required: true }),
      description: fields.text({ label: "Description" }),
      url: fields.link({ label: "URL", required: true }),
    },
  }),
};

export const docsHeroBlock = defineBlock({
  type: "docs-hero",
  category: "Docs",
  label: "Docs Hero",
  description:
    "Header for a documentation page (title, description, search); top of a docs page.",
  component: Component,
  props: docsHeroProps,
});
