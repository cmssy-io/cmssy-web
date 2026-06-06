import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsCodeBlockBlock = defineBlock({
  type: "docs-code-block",
  label: "Docs Code Block",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "code": fields.multiLine({ label: "Code", placeholder: "// Your code here", required: true }),
    "language": fields.select({ label: "Language", defaultValue: "typescript", options: ["javascript","typescript","jsx","tsx","bash","json","html","css","markdown","yaml","python","go","rust","sql","graphql","plaintext"] }),
    "filename": fields.singleLine({ label: "Filename", placeholder: "e.g., block.config.ts" }),
    "showLineNumbers": fields.boolean({ label: "Show Line Numbers", defaultValue: false }),
    "highlightLines": fields.singleLine({ label: "Highlight Lines", placeholder: "e.g., 1,3-5,8" })
  },
});
