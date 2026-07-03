import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const roadmapBlock = defineBlock({
  type: "roadmap",
  label: "Roadmap",
  description: "Product roadmap of planned, in-progress and shipped items; for a roadmap or updates page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badge": fields.singleLine({ label: "Badge Text", defaultValue: "Roadmap" }),
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Product" }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "Roadmap" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Transparency is one of our core values. Here's what we're working on and what's coming next." }),
    "columns": fields.repeater({ label: "Columns", itemSchema: {
      "title": fields.singleLine({ label: "Column Title", required: true }),
      "status": fields.select({ label: "Status Type", defaultValue: "planned", options: ["completed","in_progress","planned","considering"] }),
      "items": fields.repeater({ label: "Items", itemSchema: {
        "title": fields.singleLine({ label: "Title", required: true }),
        "description": fields.singleLine({ label: "Description" }),
        "badge": fields.singleLine({ label: "Badge (optional)" })
      } })
    } }),
    "showCta": fields.boolean({ label: "Show Feedback CTA", defaultValue: true }),
    "ctaTitle": fields.singleLine({ label: "CTA Title", defaultValue: "Shape Our Roadmap" }),
    "ctaDescription": fields.multiLine({ label: "CTA Description", defaultValue: "Have a feature request or idea? We'd love to hear from you." }),
    "ctaButtonText": fields.singleLine({ label: "CTA Button Text", defaultValue: "Submit Feedback" }),
    "ctaButtonUrl": fields.link({ label: "CTA Button URL", defaultValue: "/contact" })
  },
});
