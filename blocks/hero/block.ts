import { defineBlock, fields } from "@cmssy/react";
import Hero from "./Hero";

export const heroProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 0.1" }),
  eyebrow: fields.text({
    label: "Eyebrow",
    defaultValue: "AI-NATIVE HEADLESS CMS",
  }),
  headlineLead: fields.text({
    label: "Heading (before accent)",
    defaultValue: "This is what one content",
    required: true,
  }),
  headlineAccent: fields.text({
    label: "Heading Accent Word",
    defaultValue: "change",
  }),
  headlineTail: fields.text({
    label: "Heading (after accent)",
    defaultValue: "does.",
  }),
  subLines: fields.repeater({
    label: "Subheading Lines (3 short lines)",
    itemSchema: {
      line: fields.text({ label: "Line", required: true }),
    },
  }),
  primaryButtonText: fields.text({
    label: "Primary Button Text",
    defaultValue: "Try it free →",
  }),
  primaryButtonUrl: fields.link({
    label: "Primary Button URL",
    defaultValue: "https://cmssy.io/login",
  }),
  secondaryButtonText: fields.text({
    label: "Secondary Button Text",
    defaultValue: "See how it works",
  }),
  secondaryButtonUrl: fields.link({
    label: "Secondary Button URL",
    defaultValue: "#code",
  }),
  trustNote: fields.text({
    label: "Trust Line (mono)",
    defaultValue: "@cmssy/next · 80+ MCP tools · No card needed",
  }),

  mcpLabel: fields.text({ label: "Diagram: Inlet Label", defaultValue: "MCP" }),
  mcpTool: fields.text({
    label: "Diagram: Inlet Tool",
    defaultValue: "update_block_content",
  }),
  blockLabel: fields.text({
    label: "Diagram: Block Label",
    defaultValue: "BLOCK · HERO",
  }),
  blockFields: fields.text({
    label: "Diagram: Block Fields",
    defaultValue: "heading · text",
  }),
  fanLabel: fields.text({
    label: "Diagram: Fan Label",
    defaultValue: "LOCALE FAN",
  }),
  fanNote: fields.text({
    label: "Diagram: Fan Note",
    defaultValue: "one field, five values",
  }),
  locales: fields.repeater({
    label: "Diagram: Locales (exactly 5)",
    itemSchema: {
      code: fields.text({ label: "Locale Code", required: true }),
    },
  }),
  publishLabel: fields.text({
    label: "Diagram: Publish Label",
    defaultValue: "PUBLISH",
  }),
  publishTool: fields.text({
    label: "Diagram: Publish Tool",
    defaultValue: "publish_page · hmac",
  }),
  frontendLabel: fields.text({
    label: "Diagram: Terminus Label",
    defaultValue: "YOUR FRONTEND",
  }),
  codeLines: fields.repeater({
    label: "Diagram: Terminus Code (max 3 lines)",
    itemSchema: {
      line: fields.text({ label: "Line", required: true }),
    },
  }),
  revalidatedLabel: fields.text({
    label: "Diagram: Revalidated Counter Label",
    defaultValue: "REVALIDATED",
  }),
  deploysLabel: fields.text({
    label: "Diagram: Deploys Counter Label",
    defaultValue: "DEPLOYS",
  }),
};

export const heroBlock = defineBlock({
  type: "hero",
  category: "Marketing",
  label: "Hero",
  description:
    "Homepage hero: headline beside an animated transport diagram that follows one content change from MCP through the block and locale fan to publish, while the frontend code stays unchanged.",
  component: Hero,
  props: heroProps,
});
