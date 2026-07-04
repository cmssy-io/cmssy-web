import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsTerminalBlock = defineBlock({
  type: "docs-terminal",
  label: "Docs Terminal",
  description: "Terminal and command-line snippet display; for setup and CLI documentation.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "title": fields.text({ label: "Window Title", placeholder: "e.g., Terminal" }),
    "commands": fields.repeater({ label: "Commands", itemSchema: {
      "prompt": fields.text({ label: "Prompt", defaultValue: "$" }),
      "command": fields.text({ label: "Command", required: true }),
      "output": fields.textarea({ label: "Output" })
    } }),
    "theme": fields.select({ label: "Theme", defaultValue: "macos", options: ["dark","macos","minimal","clean"] }),
    "showCopyAll": fields.boolean({ label: "Show Copy All Button", defaultValue: true })
  },
});
