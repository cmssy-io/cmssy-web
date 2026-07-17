import { defineBlock, fields } from "@cmssy/react";
import Faq from "./Faq";

export const faqProps = {
  "fig": fields.text({ label: "Fig Number", defaultValue: "FIG 7.0" }),
  "eyebrow": fields.text({ label: "Eyebrow", defaultValue: "FAQ" }),
  "heading": fields.text({ label: "Heading", defaultValue: "Heading", required: true }),
  "headingHighlight": fields.text({ label: "Heading Highlight", defaultValue: "Highlight" }),
  "description": fields.textarea({ label: "Description", defaultValue: "Description", placeholder: "Enter description" }),
  "faqs": fields.repeater({ label: "FAQs", itemSchema: {
    "question": fields.text({ label: "Question", defaultValue: "What is your refund policy?", required: true }),
    "answer": fields.textarea({ label: "Answer", defaultValue: "We offer a 30-day money-back guarantee. If you're not satisfied with our product, simply contact our support team within 30 days of purchase for a full refund.", required: true })
  } })
};

export const faqBlock = defineBlock({
  type: "faq",
  category: "Marketing",
  label: "Faq",
  description: "Accordion of frequently asked questions; near the end of a marketing or product page.",
  component: Faq,
  props: faqProps,
});
