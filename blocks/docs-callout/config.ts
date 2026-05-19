import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Callout",
  description: "Callout boxes for documentation (info, warning, tip, danger)",
  category: "documentation",
  tags: ["docs", "callout", "info", "warning", "tip", "alert"],

  schema: {
    type: field({
      type: "select",
      label: "Type",
      required: true,
      options: [
        { value: "info", label: "Info (Blue)" },
        { value: "tip", label: "Tip (Green)" },
        { value: "warning", label: "Warning (Yellow)" },
        { value: "danger", label: "Danger (Red)" },
        { value: "note", label: "Note (Gray)" },
      ],
      defaultValue: "info",
    }),
    style: field({
      type: "select",
      label: "Style",
      options: [
        { value: "card", label: "Card (full border)" },
        { value: "accent-border", label: "Accent border (thick left bar)" },
      ],
      defaultValue: "card",
    }),
    title: field({
      type: "singleLine",
      label: "Title",
      placeholder: "Optional title",
    }),
    content: field({
      type: "richText",
      label: "Content",
      required: true,
    }),
  },
});
