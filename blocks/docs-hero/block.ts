import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsHeroBlock = defineBlock({
  type: "docs-hero",
  label: "Docs Hero",
  description: "Header for a documentation page (title, description, search); top of a docs page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badge": fields.text({ label: "Badge Text", placeholder: "e.g., Documentation" }),
    "heading": fields.text({ label: "Heading", defaultValue: "Documentation", required: true }),
    "description": fields.textarea({ label: "Description" }),
    "variant": fields.select({ label: "Variant", defaultValue: "default", options: ["default","gradient","minimal"] }),
    "showSearch": fields.boolean({ label: "Show Search Bar", defaultValue: true }),
    "searchPlaceholder": fields.text({ label: "Search Placeholder", defaultValue: "Search documentation..." }),
    "quickLinks": fields.repeater({ label: "Quick Links", itemSchema: {
      "icon": fields.text({ label: "Icon Name", placeholder: "e.g., Rocket, Book, Code" }),
      "title": fields.text({ label: "Title", required: true }),
      "description": fields.text({ label: "Description" }),
      "url": fields.link({ label: "URL", required: true })
    } })
  },
});
