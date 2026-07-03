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
    "badge": fields.singleLine({ label: "Badge Text", placeholder: "e.g., Documentation" }),
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Documentation", required: true }),
    "description": fields.multiLine({ label: "Description" }),
    "variant": fields.select({ label: "Variant", defaultValue: "default", options: ["default","gradient","minimal"] }),
    "showSearch": fields.boolean({ label: "Show Search Bar", defaultValue: true }),
    "searchPlaceholder": fields.singleLine({ label: "Search Placeholder", defaultValue: "Search documentation..." }),
    "quickLinks": fields.repeater({ label: "Quick Links", itemSchema: {
      "icon": fields.singleLine({ label: "Icon Name", placeholder: "e.g., Rocket, Book, Code" }),
      "title": fields.singleLine({ label: "Title", required: true }),
      "description": fields.singleLine({ label: "Description" }),
      "url": fields.link({ label: "URL", required: true })
    } })
  },
});
