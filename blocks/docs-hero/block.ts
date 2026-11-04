import { defineBlock, fields } from "@cmssy/react";
import DocsHero from "./DocsHero";

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
  highlight: fields.text({
    label: "Highlighted Word",
    helperText: "A word from the heading to set in the accent colour.",
  }),
  description: fields.textarea({ label: "Description" }),
  variant: fields.select({
    label: "Variant",
    defaultValue: "default",
    options: ["default", "gradient", "minimal"],
    tab: "style",
  }),
  layout: fields.select({
    label: "Layout",
    defaultValue: "centered",
    options: ["centered", "split"],
    tab: "style",
    helperText:
      "Split: heading and quick start commands on the left, quick links as a framework card on the right. The quick start and quick links card fields below only render in the split layout.",
  }),
  showSearch: fields.boolean({
    label: "Show Search Bar",
    defaultValue: true,
  }),
  searchPlaceholder: fields.text({
    label: "Search Placeholder",
    defaultValue: "Search documentation...",
  }),
  commands: fields.repeater({
    label: "Quick Start Commands",
    helperText:
      "Rows with the same tab are one tab; rows with the same tab and different runners become a runner switch (npx, pnpm, bunx).",
    itemSchema: {
      tab: fields.text({ label: "Tab", placeholder: "e.g., For you" }),
      runner: fields.text({ label: "Runner", placeholder: "e.g., npx", localized: false }),
      command: fields.text({ label: "Command", required: true, localized: false }),
      note: fields.textarea({ label: "Note" }),
      noteLabel: fields.text({ label: "Note Link Label" }),
      noteUrl: fields.link({ label: "Note Link URL", localized: false }),
    },
  }),
  copyLabel: fields.text({ label: "Copy Button Label", placeholder: "e.g., Copy" }),
  copiedLabel: fields.text({ label: "Copied Label", placeholder: "e.g., Copied" }),
  quickLinksEyebrow: fields.text({ label: "Quick Links Eyebrow", placeholder: "e.g., Quickstarts" }),
  quickLinksHeading: fields.text({ label: "Quick Links Heading" }),
  quickLinksDescription: fields.textarea({ label: "Quick Links Description" }),
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
  quickLinksMoreLabel: fields.text({ label: "Quick Links Footer Link Label" }),
  quickLinksMoreUrl: fields.link({ label: "Quick Links Footer Link URL", localized: false }),
};

export const docsHeroBlock = defineBlock({
  type: "docs-hero",
  category: "Docs",
  label: "Docs Hero",
  description:
    "Header for a documentation page (title, description, search, quick start); top of a docs page.",
  component: DocsHero,
  props: docsHeroProps,
});
