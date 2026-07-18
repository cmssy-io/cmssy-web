import { defineBlock, fields } from "@cmssy/react";
import Faq from "./Faq";

export const faqProps = {
  "fig": fields.text({ label: "Fig Number", defaultValue: "FIG 7.0" }),
  "eyebrow": fields.text({ label: "Eyebrow", defaultValue: "FAQ" }),
  "heading": fields.text({ label: "Heading", defaultValue: "Heading", required: true }),
  "headingHighlight": fields.text({ label: "Heading Highlight", defaultValue: "Highlight" }),
  "description": fields.textarea({ label: "Description", defaultValue: "Description", placeholder: "Enter description" }),
  "faqs": fields.relation({ label: "FAQs", model: "faq-item", mode: "all", sort: "order_asc" })
};

export const faqBlock = defineBlock({
  type: "faq",
  category: "Marketing",
  label: "Faq",
  description: "Accordion of frequently asked questions; near the end of a marketing or product page.",
  component: Faq,
  props: faqProps,
});
