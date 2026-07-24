import { defineBlock, fields } from "@cmssy/react";
import DocsArticle from "./DocsArticle";

export const docsArticleProps = {
  breadcrumbs: fields.repeater({
    label: "Breadcrumbs",
    itemSchema: {
      label: fields.text({ label: "Label", required: true }),
      url: fields.link({ label: "URL" }),
    },
  }),
  title: fields.text({ label: "Title", required: true }),
  description: fields.textarea({ label: "Description" }),
  lastUpdated: fields.date({ label: "Last Updated" }),
  content: fields.richText({ label: "Content", required: true }),
  showToc: fields.boolean({
    label: "Show Table of Contents",
    defaultValue: true,
  }),
  tocTitle: fields.text({ label: "TOC Title", defaultValue: "On this page" }),
  showPrevNext: fields.boolean({
    label: "Show Prev/Next Navigation",
    defaultValue: true,
  }),
  prevPage: fields.repeater({
    label: "Previous Page",
    itemSchema: {
      label: fields.text({ label: "Label", required: true }),
      url: fields.link({ label: "URL", required: true }),
    },
  }),
  nextPage: fields.repeater({
    label: "Next Page",
    itemSchema: {
      label: fields.text({ label: "Label", required: true }),
      url: fields.link({ label: "URL", required: true }),
    },
  }),
  showEditLink: fields.boolean({
    label: "Show 'Edit on GitHub' Link",
    defaultValue: true,
  }),
  editUrl: fields.link({ label: "Edit URL" }),
};

export type DocsArticleData = {
  html: string;
  toc: { id: string; text: string; level: number }[];
};

export const docsArticleBlock = defineBlock({
  type: "docs-article",
  category: "Docs",
  label: "Docs Article",
  description:
    "Long-form documentation article body; the main content of a docs page.",
  component: DocsArticle,
  // Server-side: add heading ids/TOC and syntax-highlight code blocks (shiki).
  // Dynamic imports keep unified/shiki out of the client/editor bundle; the
  // component falls back to raw content when the loader hasn't run.
  loader: async ({ content }): Promise<DocsArticleData> => {
    const raw = typeof content.content === "string" ? content.content : "";
    if (!raw) return { html: "", toc: [] };
    const { extractTocItems } = await import("@/lib/toc");
    const { highlightRichTextCode } = await import("@/lib/highlight-html");
    const { html, items } = extractTocItems(raw);
    const highlighted = await highlightRichTextCode(html);
    return { html: highlighted, toc: items };
  },
  props: docsArticleProps,
});
