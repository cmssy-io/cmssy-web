import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Docs Sidebar",
  description:
    "Documentation sidebar navigation with categories and nested pages",
  category: "documentation",
  tags: ["docs", "navigation", "sidebar", "documentation"],

  layoutPosition: "sidebar_left",

  useClient: true,
  schema: {
    logo: field({
      type: "media",
      label: "Logo",
      group: "branding",
    }),
    logoText: field({
      type: "singleLine",
      label: "Logo Text",
      defaultValue: "Docs",
      group: "branding",
    }),
    logoUrl: field({
      type: "link",
      label: "Logo Link",
      defaultValue: "/",
      group: "branding",
    }),

    sections: field({
      type: "repeater",
      label: "Navigation Sections",
      group: "navigation",
      schema: {
        title: field({
          type: "singleLine",
          label: "Section Title",
          required: true,
        }),
        pages: field({
          type: "pageSelector",
          label: "Pages",
        }),
      },
    }),

    showSearch: field({
      type: "boolean",
      label: "Show Search",
      defaultValue: true,
      group: "features",
    }),
    searchPlaceholder: field({
      type: "singleLine",
      label: "Search Placeholder",
      defaultValue: "Search docs...",
      group: "features",
      showWhen: { field: "showSearch", equals: true },
    }),

    showVersionSelector: field({
      type: "boolean",
      label: "Show Version Selector",
      defaultValue: false,
      group: "features",
    }),
    currentVersion: field({
      type: "singleLine",
      label: "Current Version",
      defaultValue: "v1.0",
      group: "features",
      showWhen: { field: "showVersionSelector", equals: true },
    }),

    githubUrl: field({
      type: "link",
      label: "GitHub URL",
      group: "links",
    }),
    slackUrl: field({
      type: "link",
      label: "Slack URL",
      group: "links",
    }),
    showLanguageSwitcher: field({
      type: "boolean",
      label: "Show Language Switcher",
      defaultValue: false,
      group: "features",
    }),
  },
});
