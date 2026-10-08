import { defineBlock, fields } from "@cmssy/react";
import Faq from "./Faq";

export const faqProps = {
  "fig": fields.text({ label: "Fig Number" }),
  "eyebrow": fields.text({ label: "Eyebrow" }),
  "heading": fields.text({ label: "Heading", required: true }),
  "headingHighlight": fields.text({ label: "Heading Highlight" }),
  "description": fields.textarea({ label: "Description", placeholder: "Enter description" }),
  "faqs": fields.relation({ label: "FAQs", model: "faq-item", mode: "picked", multiple: true, sort: "order_asc" })
};

export const faqBlock = defineBlock({
  type: "faq",
  category: "Marketing",
  label: "Faq",
  description: "Accordion of frequently asked questions; near the end of a marketing or product page.",
  component: Faq,
  props: faqProps,
});
