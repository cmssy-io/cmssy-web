import { defineBlock, fields } from "@cmssy/react";
import DocsTabs from "./DocsTabs";

export type DocsTabsData = { tabsHtml: string[] };

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
  component: DocsTabs,
  // Server-side: syntax-highlight code blocks inside each tab's richText (shiki),
  // same as docs-article. shiki is heavy and async so it stays off the client;
  // the component falls back to raw tab content when the loader hasn't run.
  loader: async ({ content }): Promise<DocsTabsData> => {
    const tabs = Array.isArray(content.tabs) ? content.tabs : [];
    const { highlightRichTextCode } = await import("@/lib/highlight-html");
    const tabsHtml = await Promise.all(
      tabs.map((tab) => {
        const raw =
          tab && typeof (tab as { content?: unknown }).content === "string"
            ? (tab as { content: string }).content
            : "";
        return highlightRichTextCode(raw);
      }),
    );
    return { tabsHtml };
  },
  props: docsTabsProps,
});
