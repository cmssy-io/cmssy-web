import { defineBlock, fields } from "@cmssy/react";
import DocsTerminal from "./DocsTerminal";

export const docsTerminalProps = {
  title: fields.text({
    label: "Window Title",
    placeholder: "e.g., Terminal",
  }),
  commands: fields.repeater({
    label: "Commands",
    itemSchema: {
      prompt: fields.text({ label: "Prompt", defaultValue: "$" }),
      command: fields.text({ label: "Command", required: true }),
      output: fields.textarea({ label: "Output" }),
    },
  }),
  theme: fields.select({
    label: "Theme",
    defaultValue: "macos",
    options: ["dark", "macos", "minimal", "clean"],
    tab: "style",
  }),
  showCopyAll: fields.boolean({
    label: "Show Copy All Button",
    defaultValue: true,
  }),
};

export const docsTerminalBlock = defineBlock({
  type: "docs-terminal",
  category: "Docs",
  label: "Docs Terminal",
  description:
    "Terminal and command-line snippet display; for setup and CLI documentation.",
  component: DocsTerminal,
  props: docsTerminalProps,
});
