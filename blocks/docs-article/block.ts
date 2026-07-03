import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsArticleBlock = defineBlock({
  type: "docs-article",
  label: "Docs Article",
  description: "Long-form documentation article body; the main content of a docs page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "breadcrumbs": fields.repeater({ label: "Breadcrumbs", itemSchema: {
      "label": fields.singleLine({ label: "Label", required: true }),
      "url": fields.link({ label: "URL" })
    } }),
    "title": fields.singleLine({ label: "Title", required: true }),
    "description": fields.multiLine({ label: "Description" }),
    "lastUpdated": fields.date({ label: "Last Updated" }),
    "content": fields.richText({ label: "Content", required: true }),
    "showToc": fields.boolean({ label: "Show Table of Contents", defaultValue: true }),
    "tocTitle": fields.singleLine({ label: "TOC Title", defaultValue: "On this page" }),
    "showPrevNext": fields.boolean({ label: "Show Prev/Next Navigation", defaultValue: true }),
    "prevPage": fields.repeater({ label: "Previous Page", itemSchema: {
      "label": fields.singleLine({ label: "Label", required: true }),
      "url": fields.link({ label: "URL", required: true })
    } }),
    "nextPage": fields.repeater({ label: "Next Page", itemSchema: {
      "label": fields.singleLine({ label: "Label", required: true }),
      "url": fields.link({ label: "URL", required: true })
    } }),
    "showEditLink": fields.boolean({ label: "Show 'Edit on GitHub' Link", defaultValue: true }),
    "editUrl": fields.link({ label: "Edit URL" })
  },
});
