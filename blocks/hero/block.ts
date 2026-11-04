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
    defaultValue: "Change the page.",
    required: true,
  }),
  headlineAccent: fields.text({
    label: "Heading Accent Word",
    defaultValue: "Deploy",
  }),
  headlineTail: fields.text({
    label: "Heading (after accent)",
    defaultValue: "nothing.",
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
    defaultValue: "@cmssy/next · 90+ MCP tools · No card needed",
  }),

  mcpLabel: fields.text({ label: "Run card: Inlet Label", defaultValue: "MCP" }),
  mcpTool: fields.text({
    label: "Run card: Inlet Tool",
    defaultValue: "update_block_content",
  }),
  blockLabel: fields.text({
    label: "Run card: Block Label",
    defaultValue: "BLOCK · HERO",
  }),
  blockFields: fields.text({
    label: "Run card: Block Fields",
    defaultValue: "heading · text",
  }),
  fanLabel: fields.text({
    label: "Run card: Fan Label",
    defaultValue: "LOCALE FAN",
  }),
  fanNote: fields.text({
    label: "Run card: Fan Note",
    defaultValue: "one field, five values",
  }),
  locales: fields.repeater({
    label: "Run card: Locales (exactly 5)",
    itemSchema: {
      code: fields.text({ label: "Locale Code", required: true }),
    },
  }),
  publishLabel: fields.text({
    label: "Run card: Publish Label",
    defaultValue: "PUBLISH",
  }),
  publishTool: fields.text({
    label: "Run card: Publish Tool",
    defaultValue: "publish_page · hmac",
  }),
  frontendLabel: fields.text({
    label: "Run card: Terminus Label",
    defaultValue: "YOUR FRONTEND",
  }),
  codeLines: fields.repeater({
    label: "Run card: Terminus Code (max 3 lines)",
    itemSchema: {
      line: fields.text({ label: "Line", required: true }),
    },
  }),
  revalidatedLabel: fields.text({
    label: "Run card: Revalidated Counter Label",
    defaultValue: "REVALIDATED",
  }),
  deploysLabel: fields.text({
    label: "Run card: Deploys Counter Label",
    defaultValue: "DEPLOYS",
  }),
};

export const heroBlock = defineBlock({
  type: "hero",
  category: "Marketing",
  label: "Hero",
  description:
    "Homepage hero: headline beside an agent run card that follows one content change from MCP through the block and locale fan to publish, while the frontend code stays unchanged, over an animated flow field.",
  component: Hero,
  props: heroProps,
});
