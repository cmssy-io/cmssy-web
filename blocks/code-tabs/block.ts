import { defineBlock, fields } from "@cmssy/react";
import CodeTabs from "./CodeTabs";

export const codeTabsProps = {
  fig: fields.text({ label: "Fig Number" }),
  eyebrow: fields.text({
    label: "Eyebrow",
  }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Real tool. Decide in ten seconds.",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
  }),
  equalHeight: fields.boolean({
    label: "Equal Height Tabs",
  }),
  tabs: fields.repeater({
    label: "Tabs",
    itemSchema: {
      label: fields.text({ label: "Tab Label", required: true }),
      comment: fields.text({
        label: "Leading Comment",
        placeholder: "// app/page.tsx - you own this file",
      }),
      code: fields.textarea({ label: "Code", required: true }),
      resultLabel: fields.text({
        label: "Result Label",
        placeholder: "e.g. response",
      }),
      result: fields.textarea({
        label: "Result",
        placeholder: "What this snippet actually produces",
      }),
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
