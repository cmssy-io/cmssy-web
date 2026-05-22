import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Article",
  description: "Documentation article with rich text content, table of contents, and navigation",
  category: "documentation",
  tags: ["docs", "article", "content", "documentation", "richtext"],

  useClient: true,
  schema: {
    breadcrumbs: field({
      type: "repeater",
      label: "Breadcrumbs",
      group: "header",
      schema: {
        label: field({
          type: "singleLine",
          label: "Label",
          required: true,
        }),
        url: field({
          type: "link",
          label: "URL",
        }),
      },
    }),
    title: field({
      type: "singleLine",
      label: "Title",
      required: true,
      group: "header",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      group: "header",
    }),
    lastUpdated: field({
      type: "date",
      label: "Last Updated",
      group: "header",
    }),

    content: field({
      type: "richText",
      label: "Content",
      required: true,
      group: "content",
    }),

    showToc: field({
      type: "boolean",
      label: "Show Table of Contents",
      defaultValue: true,
      group: "features",
    }),
    tocTitle: field({
      type: "singleLine",
      label: "TOC Title",
      defaultValue: "On this page",
      group: "features",
      showWhen: { field: "showToc", equals: true },
    }),

    showPrevNext: field({
      type: "boolean",
      label: "Show Prev/Next Navigation",
      defaultValue: true,
      group: "navigation",
    }),
    prevPage: field({
      type: "repeater",
      label: "Previous Page",
      maxItems: 1,
      group: "navigation",
      showWhen: { field: "showPrevNext", equals: true },
      schema: {
        label: field({
          type: "singleLine",
          label: "Label",
          required: true,
        }),
        url: field({
          type: "link",
          label: "URL",
          required: true,
        }),
      },
    }),
    nextPage: field({
      type: "repeater",
      label: "Next Page",
      maxItems: 1,
      group: "navigation",
      showWhen: { field: "showPrevNext", equals: true },
      schema: {
        label: field({
          type: "singleLine",
          label: "Label",
          required: true,
        }),
        url: field({
          type: "link",
          label: "URL",
          required: true,
        }),
      },
    }),

    showEditLink: field({
      type: "boolean",
      label: "Show 'Edit on GitHub' Link",
      defaultValue: true,
      group: "footer",
    }),
    editUrl: field({
      type: "link",
      label: "Edit URL",
      group: "footer",
      showWhen: { field: "showEditLink", equals: true },
    }),
  },
});
