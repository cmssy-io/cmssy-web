import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const faqBlock = defineBlock({
  type: "faq",
  label: "Faq",
  description: "Accordion of frequently asked questions; near the end of a marketing or product page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Heading", required: true }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "Highlight" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Description", placeholder: "Enter description" }),
    "faqs": fields.repeater({ label: "FAQs", itemSchema: {
      "question": fields.singleLine({ label: "Question", defaultValue: "What is your refund policy?", required: true }),
      "answer": fields.multiLine({ label: "Answer", defaultValue: "We offer a 30-day money-back guarantee. If you're not satisfied with our product, simply contact our support team within 30 days of purchase for a full refund.", required: true })
    } })
  },
});
