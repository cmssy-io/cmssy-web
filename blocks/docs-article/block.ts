import { defineBlock, fields } from "@cmssy/react";
import DocsArticle from "./DocsArticle";

export const docsArticleProps = {
    "breadcrumbs": fields.repeater({ label: "Breadcrumbs", itemSchema: {
      "label": fields.text({ label: "Label", required: true }),
      "url": fields.link({ label: "URL" })
    } }),
    "title": fields.text({ label: "Title", required: true }),
    "description": fields.textarea({ label: "Description" }),
    "lastUpdated": fields.date({ label: "Last Updated" }),
    "content": fields.richText({ label: "Content", required: true }),
    "showToc": fields.boolean({ label: "Show Table of Contents", defaultValue: true }),
    "tocTitle": fields.text({ label: "TOC Title", defaultValue: "On this page" }),
    "showPrevNext": fields.boolean({ label: "Show Prev/Next Navigation", defaultValue: true }),
    "prevPage": fields.repeater({ label: "Previous Page", itemSchema: {
      "label": fields.text({ label: "Label", required: true }),
      "url": fields.link({ label: "URL", required: true })
    } }),
    "nextPage": fields.repeater({ label: "Next Page", itemSchema: {
      "label": fields.text({ label: "Label", required: true }),
      "url": fields.link({ label: "URL", required: true })
    } }),
    "showEditLink": fields.boolean({ label: "Show 'Edit on GitHub' Link", defaultValue: true }),
    "editUrl": fields.link({ label: "Edit URL" })
};

export const docsArticleBlock = defineBlock({
  type: "docs-article",
  category: "Docs",
  label: "Docs Article",
  description: "Long-form documentation article body; the main content of a docs page.",
  component: DocsArticle,
  props: docsArticleProps,
});
