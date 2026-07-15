import { defineBlock, fields } from "@cmssy/react";
import DocsFileTree from "./DocsFileTree";

export const docsFileTreeProps = {
  "title": fields.text({ label: "Title", placeholder: "Project Structure" }),
  "tree": fields.textarea({ label: "Tree", placeholder: "src/\n├── index.ts\n├── components/\n│   └── App.tsx\n└── styles/\n    └── main.css", required: true }),
  "highlights": fields.text({ label: "Highlighted Files", placeholder: "src/index.ts,config.ts" }),
  "showIcons": fields.boolean({ label: "Show File Icons", defaultValue: true })
};

export const docsFileTreeBlock = defineBlock({
  type: "docs-file-tree",
  category: "Docs",
  label: "Docs File Tree",
  description: "File and folder tree diagram illustrating project structure; for documentation.",
  component: DocsFileTree,
  props: docsFileTreeProps,
});
