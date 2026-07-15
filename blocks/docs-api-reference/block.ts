import { defineBlock, fields } from "@cmssy/react";
import DocsApiReference from "./DocsApiReference";

export const docsApiReferenceProps = {
  title: fields.text({ label: "Title", placeholder: "getPages" }),
  description: fields.richText({ label: "Description" }),
  method: fields.select({
    label: "Method",
    defaultValue: "query",
    required: true,
    options: [
      "query",
      "mutation",
      "subscription",
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  }),
  endpoint: fields.text({
    label: "Endpoint / Operation Name",
    placeholder: "/api/graphql or getPages",
  }),
  auth: fields.select({
    label: "Authentication",
    defaultValue: "required",
    options: ["required", "optional", "none"],
  }),
  parameters: fields.repeater({
    label: "Parameters",
    itemSchema: {
      name: fields.text({ label: "Name", required: true }),
      type: fields.text({ label: "Type", required: true }),
      required: fields.boolean({ label: "Required", defaultValue: false }),
      description: fields.text({ label: "Description" }),
    },
  }),
  requestExample: fields.textarea({
    label: "Request Example",
    placeholder:
      "query GetPages {\n  public {\n    page {\n      list {\n        items {\n          id\n        }\n      }\n    }\n  }\n}",
  }),
  requestLanguage: fields.select({
    label: "Request Language",
    defaultValue: "graphql",
    options: ["graphql", "bash", "typescript", "javascript", "json"],
  }),
  responseExample: fields.textarea({
    label: "Response Example",
    placeholder:
      '{\n  "data": {\n    "public": {\n      "page": {\n        "list": {\n          "items": []\n        }\n      }\n    }\n  }\n}',
  }),
  responseLanguage: fields.select({
    label: "Response Language",
    defaultValue: "json",
    options: ["json", "typescript", "javascript"],
  }),
};

export const docsApiReferenceBlock = defineBlock({
  type: "docs-api-reference",
  category: "Docs",
  label: "Docs API Reference",
  description:
    "API endpoint and reference documentation; for documentation pages.",
  component: DocsApiReference,
  props: docsApiReferenceProps,
});
