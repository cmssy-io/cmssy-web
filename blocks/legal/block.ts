import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const legalBlock = defineBlock({
  type: "legal",
  label: "Legal",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badge": fields.singleLine({ label: "Badge Text", defaultValue: "Privacy" }),
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Privacy" }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "Policy" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Learn how we collect, use, and protect your personal information." }),
    "showSummary": fields.boolean({ label: "Show Summary Box", defaultValue: true }),
    "summaryTitle": fields.singleLine({ label: "Summary Title", defaultValue: "TL;DR" }),
    "summaryContent": fields.multiLine({ label: "Summary Content", defaultValue: "We respect your privacy and only collect data necessary to provide our services. We never sell your data." }),
    "sections": fields.repeater({ label: "Accordion Sections", itemSchema: {
      "title": fields.singleLine({ label: "Section Title", required: true }),
      "content": fields.richText({ label: "Section Content", required: true })
    } }),
    "showFooterLinks": fields.boolean({ label: "Show Footer Links", defaultValue: true }),
    "footerText": fields.singleLine({ label: "Footer Text", defaultValue: "This policy is part of our" }),
    "footerLinks": fields.repeater({ label: "Footer Links", itemSchema: {
      "text": fields.singleLine({ label: "Link Text", required: true }),
      "url": fields.link({ label: "URL", required: true })
    } }),
    "lastUpdated": fields.singleLine({ label: "Last Updated Date", defaultValue: "January 2025" })
  },
});
