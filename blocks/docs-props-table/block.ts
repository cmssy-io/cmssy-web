import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsPropsTableBlock = defineBlock({
  type: "docs-props-table",
  category: "Docs",
  label: "Docs Props Table",
  description: "Table of component props or parameters; for API and reference documentation.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "title": fields.text({ label: "Title", placeholder: "e.g., PlatformContext" }),
    "description": fields.textarea({ label: "Description" }),
    "props": fields.repeater({ label: "Properties", defaultValue: [{"name":"title","type":"string","required":true,"defaultValue":"","description":"Main heading shown above the content."},{"name":"variant","type":"\"primary\" | \"secondary\"","required":false,"defaultValue":"primary","description":"Visual style applied to the component."}], itemSchema: {
      "name": fields.text({ label: "Name", required: true }),
      "type": fields.text({ label: "Type", required: true }),
      "required": fields.boolean({ label: "Required", defaultValue: false }),
      "defaultValue": fields.text({ label: "Default Value" }),
      "description": fields.text({ label: "Description" })
    } }),
    "showDefaults": fields.boolean({ label: "Show Default Values Column", defaultValue: true }),
    "showRequired": fields.boolean({ label: "Show Required Badge", defaultValue: true })
  },
});
