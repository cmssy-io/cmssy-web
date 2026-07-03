import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const ctaBlock = defineBlock({
  type: "cta",
  label: "Call to Action",
  description: "Closing call-to-action with heading and button; place near the end of a page to drive conversion.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badgeText": fields.singleLine({ label: "Badge Text", defaultValue: "Start building today", placeholder: "Enter badge text" }),
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Ready to create something", required: true }),
    "headingLine2": fields.singleLine({ label: "Heading Line 2", defaultValue: "amazing?" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Join thousands of creators who trust cmssy to build their online presence. Start free, no credit card required.", placeholder: "Enter description" }),
    "primaryButtonText": fields.singleLine({ label: "Primary Button Text", defaultValue: "Get Started Free" }),
    "primaryButtonUrl": fields.link({ label: "Primary Button URL", defaultValue: "/signup" }),
    "secondaryButtonText": fields.singleLine({ label: "Secondary Button Text", defaultValue: "Talk to Sales" }),
    "secondaryButtonUrl": fields.link({ label: "Secondary Button URL", defaultValue: "/contact" })
  },
});
