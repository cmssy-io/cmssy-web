import { defineBlock, fields } from "@cmssy/react";
import Hero from "./Hero";
import { FALLBACK_STEPS, SCENE_TARGETS } from "./scene/types";

const SCENE_ON = { field: "showScene", notEquals: false };

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

  showScene: fields.boolean({
    label: "Show Animated Scene",
    defaultValue: true,
    localized: false,
  }),

  siteBrand: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Brand",
    defaultValue: "Orbit",
    localized: false,
  }),
  siteDomain: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Domain",
    defaultValue: "orbit.audio",
    localized: false,
  }),
  siteNav: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Nav (· separated)",
    defaultValue: "Shop · Orbit 2 · Support",
  }),
  siteHeadline: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Starting Headline",
    defaultValue: "Sound, unplugged.",
  }),
  siteButton: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Starting Button",
    defaultValue: "Shop now",
  }),
  productName: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Product Name",
    defaultValue: "Orbit 2",
    localized: false,
  }),
  productPrice: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Product Price",
    defaultValue: "$349",
  }),
  productVariants: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Product Variants (Name:#hex · separated)",
    defaultValue: "Blue:#00a8f0 · Silver:#e8ebf0 · Graphite:#3a4252",
  }),
  modelName: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Content Model Name",
    defaultValue: "Product",
    localized: false,
  }),
  modelFields: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Model Fields (name:Type · separated)",
    defaultValue: "name:Text · price:Number · color:Select",
    localized: false,
  }),
  adminLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Admin Tab Label",
    defaultValue: "cmssy",
    localized: false,
  }),
  adminNav: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Admin Sidebar (· separated)",
    defaultValue: "Pages · Products · Models · Media",
  }),
  recordCount: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Model Record Count",
    defaultValue: "12 records",
  }),
  addFieldLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Add Field Button",
    defaultValue: "Add field",
  }),
  addVariantLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Add Variant Button",
    defaultValue: "Add variant",
  }),
  savedLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Saved Toast",
    defaultValue: "Saved",
  }),
  queryStatus: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: API Response Status",
    defaultValue: "200 · 38 ms",
    localized: false,
  }),
  agentName: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Agent Name",
    defaultValue: "Claude",
    localized: false,
  }),
  chatTitle: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Chat Title",
    defaultValue: "Orbit store",
  }),
  thinkingLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Thinking Label",
    defaultValue: "Thinking",
  }),
  composerPlaceholder: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Chat Input Placeholder",
    defaultValue: "Reply to Claude",
  }),
  steps: fields.repeater({
    showWhen: SCENE_ON,
    label: "Scene: Edits (played in a loop)",
    defaultValue: FALLBACK_STEPS,
    itemSchema: {
      prompt: fields.text({ label: "Prompt", required: true }),
      target: fields.select({
        label: "Edited Element",
        defaultValue: "headline",
        options: SCENE_TARGETS,
        localized: false,
      }),
      text: fields.text({
        label:
          "New Value (text; #hex color for accent; variant name; new field name for model)",
        showWhen: { field: "target", notEquals: "layout" },
      }),
      detail: fields.text({
        label: "Variant: SKU Line in Panel",
        showWhen: { field: "target", equals: "variant" },
      }),
      color: fields.text({
        label: "Variant: Color (hex)",
        localized: false,
        showWhen: { field: "target", equals: "variant" },
      }),
      query: fields.text({
        label: "Variant: API Query Shown After Save",
        localized: false,
        showWhen: { field: "target", equals: "variant" },
      }),
      modelValue: fields.text({
        label: "Model: Value Shown on Site",
        showWhen: { field: "target", equals: "model" },
      }),
      modelQuery: fields.text({
        label: "Model: API Query Shown After Save",
        localized: false,
        showWhen: { field: "target", equals: "model" },
      }),
      tool: fields.text({
        label: "Tool Chips (join several with +)",
        defaultValue: "update_block_content",
        localized: false,
      }),
      reply: fields.text({ label: "Agent Reply" }),
    },
  }),
};

export const heroBlock = defineBlock({
  type: "hero",
  category: "Marketing",
  label: "Hero",
  description:
    "Homepage hero: short headline above a looping scene where an AI agent in a phone chat edits a demo store over MCP (copy, style, layout) and changes product data in the cmssy panel (a new variant, a new model field), then shows the API returning the update, over an animated flow field.",
  component: Hero,
  props: heroProps,
});
