import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const docsSidebarBlock = defineBlock({
  type: "docs-sidebar",
  label: "Docs Sidebar",
  description: "Documentation navigation sidebar (layout block); left rail across docs pages.",
  layoutPositions: ["sidebar_left"],
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
  }>,
  props: {
    logo: fields.media({ label: "Logo" }),
    logoText: fields.text({ label: "Logo Text", defaultValue: "Docs" }),
    logoUrl: fields.link({ label: "Logo Link", defaultValue: "/" }),
    sections: fields.repeater({
      label: "Navigation Sections",
      itemSchema: {
        title: fields.text({ label: "Section Title", required: true }),
        pages: fields.repeater({
          label: "Pages",
          itemSchema: {
            slug: fields.link({ label: "Page", required: true }),
          },
        }),
      },
    }),
    showSearch: fields.boolean({ label: "Show Search", defaultValue: true }),
    searchPlaceholder: fields.text({
      label: "Search Placeholder",
      defaultValue: "Search docs...",
    }),
    showVersionSelector: fields.boolean({
      label: "Show Version Selector",
      defaultValue: false,
    }),
    currentVersion: fields.text({
      label: "Current Version",
      defaultValue: "v1.0",
    }),
    githubUrl: fields.link({ label: "GitHub URL" }),
    slackUrl: fields.link({ label: "Slack URL" }),
    showLanguageSwitcher: fields.boolean({
      label: "Show Language Switcher",
      defaultValue: false,
    }),
  },
});
