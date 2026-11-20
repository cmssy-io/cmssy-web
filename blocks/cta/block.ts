import { defineBlock, fields } from "@cmssy/react";
import Cta from "./Cta";

export const ctaProps = {
  "badgeText": fields.text({ label: "Badge Text", placeholder: "Enter badge text" }),
  "heading": fields.text({ label: "Heading", defaultValue: "Ready to create something", required: true }),
  "headingLine2": fields.text({ label: "Heading Line 2" }),
  "description": fields.textarea({ label: "Description", placeholder: "Enter description" }),
  "primaryButtonText": fields.text({ label: "Primary Button Text" }),
  "primaryButtonUrl": fields.link({ label: "Primary Button URL" }),
  "secondaryButtonText": fields.text({ label: "Secondary Button Text" }),
  "secondaryButtonUrl": fields.link({ label: "Secondary Button URL" })
};

export const ctaBlock = defineBlock({
  type: "cta",
  category: "Marketing",
  label: "Call to Action",
  description: "Closing call-to-action with heading and button; place near the end of a page to drive conversion.",
  component: Cta,
  props: ctaProps,
});
