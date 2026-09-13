import { defineBlock, fields } from "@cmssy/react";
import DocsToolCatalogue from "./DocsToolCatalogue";

export const docsToolCatalogueProps = {
  title: fields.text({ label: "Title", defaultValue: "Every MCP tool" }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "Generated from the MCP server itself, so a tool cannot be listed here before it is callable.",
  }),
  toolHeader: fields.text({
    label: "Tool column header",
    defaultValue: "Tool",
    required: true,
  }),
  permissionHeader: fields.text({
    label: "Permission column header",
    defaultValue: "Permission",
    required: true,
  }),
  purposeHeader: fields.text({
    label: "Purpose column header",
    defaultValue: "What it does",
    required: true,
  }),
  noPermissionLabel: fields.text({
    label: "Word for a tool that needs no permission",
    defaultValue: "none",
  }),
  tools: fields.repeater({
    label: "Tools (generated - do not edit by hand)",
    itemSchema: {
      name: fields.text({ label: "Tool", required: true, localized: false }),
      permission: fields.text({ label: "Permission", localized: false }),
      description: fields.textarea({
        label: "What it does",
        localized: false,
      }),
    },
  }),
  note: fields.textarea({ label: "Note under the table" }),
};

export const docsToolCatalogueBlock = defineBlock({
  type: "docs-tool-catalogue",
  category: "Docs",
  label: "Docs Tool Catalogue",
  description:
    "The MCP server's full tool list, generated from the server's own handshake; the rows are the same in every language.",
  component: DocsToolCatalogue,
  props: docsToolCatalogueProps,
});
