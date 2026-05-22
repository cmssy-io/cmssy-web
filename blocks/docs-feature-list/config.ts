import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Feature List",
  description:
    "Checklist of documented features with violet icons and optional descriptions",
  category: "documentation",
  tags: ["docs", "features", "checklist", "list"],

  schema: {
    heading: field({
      type: "singleLine",
      label: "Heading",
      placeholder: "e.g., Kluczowe możliwości",
      group: "header",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      group: "header",
    }),

    icon: field({
      type: "select",
      label: "Default Icon",
      group: "style",
      defaultValue: "CheckCircle2",
      options: [
        { value: "CheckCircle2", label: "Check circle" },
        { value: "Check", label: "Check" },
        { value: "Sparkles", label: "Sparkles" },
        { value: "Zap", label: "Zap" },
        { value: "Star", label: "Star" },
        { value: "Circle", label: "Circle" },
      ],
    }),
    iconColor: field({
      type: "select",
      label: "Icon Color",
      group: "style",
      defaultValue: "violet",
      options: [
        { value: "violet", label: "Violet (brand)" },
        { value: "emerald", label: "Emerald" },
        { value: "blue", label: "Blue" },
        { value: "amber", label: "Amber" },
        { value: "foreground", label: "Foreground" },
      ],
    }),
    layout: field({
      type: "select",
      label: "Layout",
      group: "style",
      defaultValue: "stacked",
      options: [
        { value: "stacked", label: "Stacked (single column)" },
        { value: "grid-2", label: "Grid (2 columns)" },
      ],
    }),

    items: field({
      type: "repeater",
      label: "Items",
      schema: {
        title: field({
          type: "singleLine",
          label: "Title",
          required: true,
        }),
        description: field({
          type: "multiLine",
          label: "Description",
        }),
        icon: field({
          type: "select",
          label: "Icon (override)",
          options: [
            { value: "CheckCircle2", label: "Check circle" },
            { value: "Check", label: "Check" },
            { value: "Sparkles", label: "Sparkles" },
            { value: "Zap", label: "Zap" },
            { value: "Star", label: "Star" },
            { value: "Circle", label: "Circle" },
          ],
        }),
      },
    }),
  },
});
