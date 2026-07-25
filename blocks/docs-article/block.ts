import { defineBlock, fields } from "@cmssy/react";
import DocsArticle from "./DocsArticle";

// Breadcrumbs and prev/next are not fields here: both come from the page's
// place in the CMS tree and are rendered route-level (see lib/docs-nav.ts), so
// an editor cannot enter a trail that disagrees with the sidebar.
export const docsArticleProps = {
  title: fields.text({ label: "Title", required: true }),
  description: fields.textarea({ label: "Description" }),
  lastUpdated: fields.date({ label: "Last Updated" }),
  content: fields.richText({ label: "Content", required: true }),
  showToc: fields.boolean({
    label: "Show Table of Contents",
    defaultValue: true,
  }),
  // No default: the heading above the TOC is copy, and copy is written in the
  // CMS, in the languages the workspace has - not in English here.
  tocTitle: fields.text({ label: "TOC Title" }),
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
