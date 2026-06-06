import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsFeatureListBlock = defineBlock({
  type: "docs-feature-list",
  label: "Docs Feature List",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading", placeholder: "e.g., Kluczowe możliwości" }),
    "description": fields.multiLine({ label: "Description" }),
    "icon": fields.select({ label: "Default Icon", defaultValue: "CheckCircle2", options: ["CheckCircle2","Check","Sparkles","Zap","Star","Circle"] }),
    "iconColor": fields.select({ label: "Icon Color", defaultValue: "violet", options: ["violet","emerald","blue","amber","foreground"] }),
    "layout": fields.select({ label: "Layout", defaultValue: "stacked", options: ["stacked","grid-2"] }),
    "items": fields.repeater({ label: "Items", itemSchema: {
      "title": fields.singleLine({ label: "Title", required: true }),
      "description": fields.multiLine({ label: "Description" }),
      "icon": fields.select({ label: "Icon (override)", options: ["CheckCircle2","Check","Sparkles","Zap","Star","Circle"] })
    } })
  },
});
