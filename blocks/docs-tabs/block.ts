import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsTabsProps = {
  tabs: fields.repeater({
    label: "Tabs",
    itemSchema: {
      label: fields.text({ label: "Tab Label", required: true }),
      icon: fields.text({
        label: "Icon Name",
        placeholder: "e.g., Terminal, Package",
      }),
      content: fields.richText({ label: "Tab Content", required: true }),
    },
  }),
  defaultTab: fields.number({ label: "Default Tab Index", defaultValue: 0 }),
  variant: fields.select({
    label: "Tab Style",
    defaultValue: "underline",
    options: ["underline", "pills", "bordered"],
    tab: "style",
  }),
};

export const docsTabsBlock = defineBlock({
  type: "docs-tabs",
  category: "Docs",
  label: "Docs Tabs",
  description:
    "Tabbed content switcher (e.g. code per language); inline within documentation.",
  component: Component,
  props: docsTabsProps,
});
