import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Tabs",
  description: "Tabbed content for code variants and documentation sections",
  category: "documentation",
  tags: ["docs", "tabs", "code", "variants", "npm", "yarn"],

  useClient: true,
  schema: {
    tabs: field({
      type: "repeater",
      label: "Tabs",
      group: "tabs",
      schema: {
        label: field({
          type: "singleLine",
          label: "Tab Label",
          required: true,
        }),
        icon: field({
          type: "singleLine",
          label: "Icon Name",
          placeholder: "e.g., Terminal, Package",
          helpText: "Lucide icon name (optional)",
        }),
        content: field({
          type: "richText",
          label: "Tab Content",
          required: true,
        }),
      },
    }),

    defaultTab: field({
      type: "numeric",
      label: "Default Tab Index",
      defaultValue: 0,
      group: "settings",
    }),
    variant: field({
      type: "select",
      label: "Tab Style",
      options: [
        { value: "underline", label: "Underline" },
        { value: "pills", label: "Pills" },
        { value: "bordered", label: "Bordered" },
      ],
      defaultValue: "underline",
      group: "settings",
    }),
  },
});
