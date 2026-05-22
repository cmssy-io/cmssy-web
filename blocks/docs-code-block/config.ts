import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Code Block",
  description: "Code block with syntax highlighting, copy button, and optional filename",
  category: "documentation",
  tags: ["docs", "code", "syntax", "highlighting", "copy"],

  useClient: true,
  schema: {
    code: field({
      type: "multiLine",
      label: "Code",
      required: true,
      placeholder: "// Your code here",
    }),
    language: field({
      type: "select",
      label: "Language",
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "jsx", label: "JSX" },
        { value: "tsx", label: "TSX" },
        { value: "bash", label: "Bash/Shell" },
        { value: "json", label: "JSON" },
        { value: "html", label: "HTML" },
        { value: "css", label: "CSS" },
        { value: "markdown", label: "Markdown" },
        { value: "yaml", label: "YAML" },
        { value: "python", label: "Python" },
        { value: "go", label: "Go" },
        { value: "rust", label: "Rust" },
        { value: "sql", label: "SQL" },
        { value: "graphql", label: "GraphQL" },
        { value: "plaintext", label: "Plain Text" },
      ],
      defaultValue: "typescript",
    }),
    filename: field({
      type: "singleLine",
      label: "Filename",
      placeholder: "e.g., block.config.ts",
    }),
    showLineNumbers: field({
      type: "boolean",
      label: "Show Line Numbers",
      defaultValue: false,
    }),
    highlightLines: field({
      type: "singleLine",
      label: "Highlight Lines",
      placeholder: "e.g., 1,3-5,8",
      helpText: "Comma-separated line numbers or ranges to highlight",
    }),
  },
});
