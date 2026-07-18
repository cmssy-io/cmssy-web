import { defineBlock, fields } from "@cmssy/react";
import Hero from "./Hero";

export const heroProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 0.1" }),
  eyebrow: fields.text({
    label: "Eyebrow",
    defaultValue: "AI-NATIVE HEADLESS CMS",
  }),
  headingPre: fields.text({
    label: "Heading Before Word",
    defaultValue: "Content",
    required: true,
  }),
  rotatingWords: fields.repeater({
    label: "Rotating Words",
    itemSchema: {
      word: fields.text({ label: "Word", required: true }),
    },
  }),
  headingPost: fields.text({
    label: "Heading After Word (same line)",
    defaultValue: "edits.",
  }),
  headingLine2: fields.text({
    label: "Heading Line 2",
    defaultValue: "A frontend you own.",
  }),
  subheading: fields.textarea({
    label: "Subheading",
    defaultValue:
      "The structured content model and visual editor your team actually uses — plus Claude editing content through MCP. Delivered to any Next.js site you own and deploy. No tickets, no redeploys.",
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
  trustLine: fields.text({
    label: "Trust Line (mono)",
    defaultValue: "@cmssy/next · 70+ MCP tools · No card needed",
  }),
  chatPrompt: fields.text({
    label: "Mockup: Chat Prompt",
    defaultValue: "add a testimonials section in German",
  }),
  chatStatus: fields.text({
    label: "Mockup: Chat Status",
    defaultValue: "via MCP · block created, page published",
  }),
  mockupTitle: fields.text({
    label: "Mockup: Title Bar",
    defaultValue: "Cmssy · Homepage",
  }),
  mockupBadge: fields.text({
    label: "Mockup: Status Badge",
    defaultValue: "Published",
  }),
  mockupMeta: fields.text({
    label: "Mockup: Meta (right side)",
    defaultValue: "EN",
  }),
  mockupPages: fields.repeater({
    label: "Mockup: Pages Panel",
    itemSchema: {
      name: fields.text({ label: "Page Name", required: true }),
      tag: fields.text({ label: "Tag", placeholder: "e.g. Draft" }),
    },
  }),
  mockupDockLabel: fields.text({
    label: "Mockup: Docking Block Label",
    defaultValue: "Kundenstimmen",
  }),
  mockupDockTag: fields.text({
    label: "Mockup: Docking Block Tag",
    defaultValue: "DE",
  }),
  mockupDockSub: fields.text({
    label: "Mockup: Docking Block Subtitle",
    defaultValue: "testimonials · de",
  }),
  inspectorTitle: fields.text({
    label: "Mockup: Inspector Title",
    defaultValue: "Header Navigation",
  }),
  inspectorSubtitle: fields.text({
    label: "Mockup: Inspector Subtitle",
    defaultValue: "Edit this block's content",
  }),
  inspectorFooter: fields.text({
    label: "Mockup: Inspector Footer",
    defaultValue: "typed fields",
  }),
};

export const heroBlock = defineBlock({
  type: "hero",
  category: "Marketing",
  label: "Hero",
  description:
    "Homepage hero: rotating-word headline, CTAs, mono trust line and an animated editor mockup with a Claude-over-MCP demo loop.",
  component: Hero,
  props: heroProps,
});
