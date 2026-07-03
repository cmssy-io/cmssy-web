import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const pricingBlock = defineBlock({
  type: "pricing",
  label: "Pricing",
  description: "Pricing plans and tiers comparison; a mid-to-late section on a marketing or pricing page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Heading", required: true }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "Highlight" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Description", placeholder: "Enter description" }),
    "trialNotice": fields.singleLine({ label: "Trial Notice", defaultValue: "14-day free trial on all paid plans. No credit card required." }),
    "popularBadgeText": fields.singleLine({ label: "Popular Badge Text", defaultValue: "MOST POPULAR" }),
    "plans": fields.repeater({ label: "Plans", itemSchema: {
      "name": fields.singleLine({ label: "Plan Name", defaultValue: "Basic", required: true }),
      "description": fields.multiLine({ label: "Plan Description", defaultValue: "Description of the plan." }),
      "price": fields.singleLine({ label: "Price", defaultValue: "$0/mo", required: true }),
      "popular": fields.boolean({ label: "Is Popular?", defaultValue: false }),
      "period": fields.singleLine({ label: "Billing Period", defaultValue: "billed annually" }),
      "features": fields.repeater({ label: "Features", itemSchema: {
        "feature": fields.singleLine({ label: "Feature", defaultValue: "Feature", required: true })
      } }),
      "cta": fields.singleLine({ label: "Call to Action", defaultValue: "Get Started", required: true }),
      "href": fields.link({ label: "Link", defaultValue: "#", required: true })
    } })
  },
});
