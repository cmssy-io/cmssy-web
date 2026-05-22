import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs API Reference",
  description:
    "API endpoint documentation with method badge, parameters, and code examples",
  category: "documentation",
  tags: ["docs", "api", "reference", "endpoint", "graphql", "rest"],
  useClient: true,
  schema: {
    title: field({
      type: "singleLine",
      label: "Title",
      placeholder: "getPages",
      group: "header",
    }),
    description: field({
      type: "richText",
      label: "Description",
      group: "header",
    }),
    method: field({
      type: "select",
      label: "Method",
      required: true,
      options: [
        { value: "query", label: "Query" },
        { value: "mutation", label: "Mutation" },
        { value: "subscription", label: "Subscription" },
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "DELETE", label: "DELETE" },
      ],
      defaultValue: "query",
      group: "header",
    }),
    endpoint: field({
      type: "singleLine",
      label: "Endpoint / Operation Name",
      placeholder: "/api/graphql or getPages",
      group: "header",
    }),
    auth: field({
      type: "select",
      label: "Authentication",
      options: [
        { value: "required", label: "Required" },
        { value: "optional", label: "Optional" },
        { value: "none", label: "None" },
      ],
      defaultValue: "required",
      group: "header",
    }),
    parameters: field({
      type: "repeater",
      label: "Parameters",
      group: "parameters",
      schema: {
        name: field({
          type: "singleLine",
          label: "Name",
          required: true,
        }),
        type: field({
          type: "singleLine",
          label: "Type",
          required: true,
        }),
        required: field({
          type: "boolean",
          label: "Required",
          defaultValue: false,
        }),
        description: field({
          type: "singleLine",
          label: "Description",
        }),
      },
    }),
    requestExample: field({
      type: "multiLine",
      label: "Request Example",
      placeholder: "query GetPages {\n  pages {\n    id\n    title\n  }\n}",
      group: "examples",
    }),
    requestLanguage: field({
      type: "select",
      label: "Request Language",
      options: [
        { value: "graphql", label: "GraphQL" },
        { value: "bash", label: "cURL" },
        { value: "typescript", label: "TypeScript" },
        { value: "javascript", label: "JavaScript" },
        { value: "json", label: "JSON" },
      ],
      defaultValue: "graphql",
      group: "examples",
    }),
    responseExample: field({
      type: "multiLine",
      label: "Response Example",
      placeholder: '{\n  "data": {\n    "pages": []\n  }\n}',
      group: "examples",
    }),
    responseLanguage: field({
      type: "select",
      label: "Response Language",
      options: [
        { value: "json", label: "JSON" },
        { value: "typescript", label: "TypeScript" },
        { value: "javascript", label: "JavaScript" },
      ],
      defaultValue: "json",
      group: "examples",
    }),
  },
});
