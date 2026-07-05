import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const notFoundBlock = defineBlock({
  type: "not-found",
  category: "Content",
  label: "404 Not Found",
  description: "404 error content; for a not-found page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.text({ label: "Heading", defaultValue: "404", placeholder: "e.g., 404, Oops!, Lost?" }),
    "title": fields.text({ label: "Title", defaultValue: "Page not found" }),
    "description": fields.textarea({ label: "Description", defaultValue: "The page you're looking for doesn't exist or has been moved. Let's get you back on track." }),
    "primaryButtonText": fields.text({ label: "Primary Button Text", defaultValue: "Back to Home" }),
    "primaryButtonUrl": fields.link({ label: "Primary Button URL", defaultValue: "/" }),
    "secondaryButtonText": fields.text({ label: "Secondary Button Text", defaultValue: "Contact Support" }),
    "secondaryButtonUrl": fields.link({ label: "Secondary Button URL", defaultValue: "/contact" })
  },
});
