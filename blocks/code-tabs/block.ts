import { defineBlock, fields } from "@cmssy/react";
import CodeTabs from "./CodeTabs";

export const codeTabsProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 1.0" }),
  eyebrow: fields.text({
    label: "Eyebrow",
    defaultValue: "DEVELOPER SURFACE",
  }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Real tool. Decide in ten seconds.",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "Fetch typed content and render blocks you own. Same content over the SDK, GraphQL, or the MCP server.",
  }),
  equalHeight: fields.boolean({
    label: "Equal Height Tabs",
    defaultValue: true,
  }),
  tabs: fields.repeater({
    label: "Tabs",
    itemSchema: {
      label: fields.text({ label: "Tab Label", required: true }),
      comment: fields.text({
        label: "Leading Comment",
        placeholder: "// app/page.tsx — you own this file",
      }),
      code: fields.textarea({ label: "Code", required: true }),
    },
  }),
};

export const codeTabsBlock = defineBlock({
  type: "code-tabs",
  category: "Marketing",
  label: "Code Tabs",
  description:
    "Dark tabbed code terminal showing the developer surface (SDK, GraphQL, MCP) with a FIG eyebrow heading.",
  component: CodeTabs,
  props: codeTabsProps,
});
