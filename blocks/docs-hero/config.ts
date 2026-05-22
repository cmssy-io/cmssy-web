import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Hero",
  description: "Documentation landing page hero with search and quick links",
  category: "documentation",
  tags: ["docs", "hero", "landing", "documentation", "search"],

  useClient: true,
  schema: {
    badge: field({
      type: "singleLine",
      label: "Badge Text",
      placeholder: "e.g., Documentation",
      group: "header",
    }),
    heading: field({
      type: "singleLine",
      label: "Heading",
      required: true,
      defaultValue: "Documentation",
      group: "header",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      group: "header",
    }),

    variant: field({
      type: "select",
      label: "Variant",
      options: [
        { value: "default", label: "Default" },
        { value: "gradient", label: "Gradient" },
        { value: "minimal", label: "Minimal" },
      ],
      defaultValue: "default",
      group: "style",
    }),

    showSearch: field({
      type: "boolean",
      label: "Show Search Bar",
      defaultValue: true,
      group: "search",
    }),
    searchPlaceholder: field({
      type: "singleLine",
      label: "Search Placeholder",
      defaultValue: "Search documentation...",
      group: "search",
      showWhen: { field: "showSearch", equals: true },
    }),

    quickLinks: field({
      type: "repeater",
      label: "Quick Links",
      group: "links",
      schema: {
        icon: field({
          type: "singleLine",
          label: "Icon Name",
          placeholder: "e.g., Rocket, Book, Code",
          helpText: "Lucide icon name",
        }),
        title: field({
          type: "singleLine",
          label: "Title",
          required: true,
        }),
        description: field({
          type: "singleLine",
          label: "Description",
        }),
        url: field({
          type: "link",
          label: "URL",
          required: true,
        }),
      },
    }),
  },
});
