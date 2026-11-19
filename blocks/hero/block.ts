import { defineBlock, fields } from "@cmssy/react";
import Hero from "./Hero";
import { FALLBACK_STEPS, SCENE_TARGETS } from "./scene/types";

export const heroProps = {
  headlineLead: fields.text({
    label: "Heading (before accent)",
    defaultValue: "Tell Claude.",
    required: true,
  }),
  headlineAccent: fields.text({
    label: "Heading Accent Word",
    defaultValue: "Your site",
  }),
  headlineTail: fields.text({
    label: "Heading (after accent)",
    defaultValue: "updates.",
  }),
  subheading: fields.text({
    label: "Subheading",
    defaultValue:
      "cmssy connects your Next.js site to Claude, Cursor and Codex over MCP.",
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

  siteBrand: fields.text({
    label: "Scene: Demo Site Brand",
    defaultValue: "Orbit",
  }),
  siteDomain: fields.text({
    label: "Scene: Demo Site Domain",
    defaultValue: "orbit.audio",
  }),
  siteNav: fields.text({
    label: "Scene: Demo Site Nav (· separated)",
    defaultValue: "Shop · Orbit 2 · Support",
  }),
  siteHeadline: fields.text({
    label: "Scene: Demo Site Starting Headline",
    defaultValue: "Sound, unplugged.",
  }),
  siteButton: fields.text({
    label: "Scene: Demo Site Starting Button",
    defaultValue: "Shop now",
  }),
  agentName: fields.text({
    label: "Scene: Agent Name",
    defaultValue: "Claude",
  }),
  chatTitle: fields.text({
    label: "Scene: Chat Title",
    defaultValue: "Orbit store",
  }),
  thinkingLabel: fields.text({
    label: "Scene: Thinking Label",
    defaultValue: "Thinking",
  }),
  steps: fields.repeater({
    label: "Scene: Edits (played in a loop)",
    defaultValue: FALLBACK_STEPS,
    itemSchema: {
      prompt: fields.text({ label: "Prompt", required: true }),
      target: fields.select({
        label: "Edited Element",
        defaultValue: "headline",
        options: SCENE_TARGETS,
      }),
      text: fields.text({
        label: "New Value (text, or hex color for accent; ignored for layout)",
      }),
      tool: fields.text({ label: "Tool Chip", defaultValue: "update_block_content" }),
      reply: fields.text({ label: "Agent Reply" }),
    },
  }),
};

export const heroBlock = defineBlock({
  type: "hero",
  category: "Marketing",
  label: "Hero",
  description:
    "Homepage hero: short headline above a looping scene where an AI agent in a phone chat clicks a demo site's text and rewrites it over MCP, over an animated flow field.",
  component: Hero,
  props: heroProps,
});
