import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsApiReferenceBlock = defineBlock({
  type: "docs-api-reference",
  label: "Docs API Reference",
  description: "API endpoint and reference documentation; for documentation pages.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "title": fields.text({ label: "Title", placeholder: "getPages" }),
    "description": fields.richText({ label: "Description" }),
    "method": fields.select({ label: "Method", defaultValue: "query", required: true, options: ["query","mutation","subscription","GET","POST","PUT","DELETE"] }),
    "endpoint": fields.text({ label: "Endpoint / Operation Name", placeholder: "/api/graphql or getPages" }),
    "auth": fields.select({ label: "Authentication", defaultValue: "required", options: ["required","optional","none"] }),
    "parameters": fields.repeater({ label: "Parameters", itemSchema: {
      "name": fields.text({ label: "Name", required: true }),
      "type": fields.text({ label: "Type", required: true }),
      "required": fields.boolean({ label: "Required", defaultValue: false }),
      "description": fields.text({ label: "Description" })
    } }),
    "requestExample": fields.textarea({ label: "Request Example", placeholder: "query GetPages {\n  pages {\n    id\n    title\n  }\n}" }),
    "requestLanguage": fields.select({ label: "Request Language", defaultValue: "graphql", options: ["graphql","bash","typescript","javascript","json"] }),
    "responseExample": fields.textarea({ label: "Response Example", placeholder: "{\n  \"data\": {\n    \"pages\": []\n  }\n}" }),
    "responseLanguage": fields.select({ label: "Response Language", defaultValue: "json", options: ["json","typescript","javascript"] })
  },
});
