import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsFileTreeBlock = defineBlock({
  type: "docs-file-tree",
  label: "Docs File Tree",
  description: "File and folder tree diagram illustrating project structure; for documentation.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "title": fields.singleLine({ label: "Title", placeholder: "Project Structure" }),
    "tree": fields.multiLine({ label: "Tree", placeholder: "src/\n├── index.ts\n├── components/\n│   └── App.tsx\n└── styles/\n    └── main.css", required: true }),
    "highlights": fields.singleLine({ label: "Highlighted Files", placeholder: "src/index.ts,config.ts" }),
    "showIcons": fields.boolean({ label: "Show File Icons", defaultValue: true })
  },
});
