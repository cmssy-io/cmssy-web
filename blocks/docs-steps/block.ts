import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsStepsBlock = defineBlock({
  type: "docs-steps",
  label: "Docs Steps",
  description: "Numbered step-by-step guide; for tutorials and how-to documentation.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading" }),
    "description": fields.multiLine({ label: "Description" }),
    "steps": fields.repeater({ label: "Steps", itemSchema: {
      "title": fields.singleLine({ label: "Step Title", required: true }),
      "content": fields.richText({ label: "Step Content" })
    } }),
    "showNumbers": fields.boolean({ label: "Show Step Numbers", defaultValue: true }),
    "connectorStyle": fields.select({ label: "Connector Style", defaultValue: "line", options: ["line","dashed","dots"] })
  },
});
