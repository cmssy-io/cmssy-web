import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Image",
  description: "Image with caption, zoom lightbox, and size options",
  category: "documentation",
  tags: ["docs", "image", "screenshot", "figure", "caption"],

  useClient: true,
  schema: {
    src: field({
      type: "media",
      label: "Image",
      required: true,
      group: "image",
    }),
    alt: field({
      type: "singleLine",
      label: "Alt Text",
      required: true,
      group: "image",
    }),
    caption: field({
      type: "singleLine",
      label: "Caption",
      group: "image",
    }),

    width: field({
      type: "select",
      label: "Width",
      options: [
        { value: "small", label: "Small (480px)" },
        { value: "medium", label: "Medium (640px)" },
        { value: "large", label: "Large (800px)" },
        { value: "full", label: "Full Width" },
      ],
      defaultValue: "large",
      group: "style",
    }),
    border: field({
      type: "boolean",
      label: "Show Border",
      defaultValue: true,
      group: "style",
    }),
    rounded: field({
      type: "boolean",
      label: "Rounded Corners",
      defaultValue: true,
      group: "style",
    }),
    shadow: field({
      type: "boolean",
      label: "Shadow",
      defaultValue: true,
      group: "style",
    }),
    zoomable: field({
      type: "boolean",
      label: "Click to Zoom",
      defaultValue: true,
      group: "style",
    }),
  },
});
