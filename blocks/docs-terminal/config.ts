import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Terminal",
  description: "Terminal/CLI visualization with commands and output",
  category: "documentation",
  tags: ["docs", "terminal", "cli", "command", "shell", "bash"],

  useClient: true,
  schema: {
    title: field({
      type: "singleLine",
      label: "Window Title",
      placeholder: "e.g., Terminal",
      group: "header",
    }),

    commands: field({
      type: "repeater",
      label: "Commands",
      group: "commands",
      schema: {
        prompt: field({
          type: "singleLine",
          label: "Prompt",
          defaultValue: "$",
        }),
        command: field({
          type: "singleLine",
          label: "Command",
          required: true,
        }),
        output: field({
          type: "multiLine",
          label: "Output",
        }),
      },
    }),

    theme: field({
      type: "select",
      label: "Theme",
      options: [
        { value: "dark", label: "Dark" },
        { value: "macos", label: "macOS" },
        { value: "minimal", label: "Minimal" },
        { value: "clean", label: "Clean (dev)" },
      ],
      defaultValue: "macos",
      group: "style",
    }),
    showCopyAll: field({
      type: "boolean",
      label: "Show Copy All Button",
      defaultValue: true,
      group: "style",
    }),
  },
});
