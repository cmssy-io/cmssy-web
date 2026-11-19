import { defineBlock, fields } from "@cmssy/react";
import Hero from "./Hero";
import { SCENE_TARGETS } from "./scene/types";

const SCENE_ON = { field: "showScene", notEquals: false };

export const heroProps = {
  headlineLead: fields.text({
    label: "Heading (before accent)",
    required: true,
  }),
  headlineAccent: fields.text({
    label: "Heading Accent Word",
  }),
  headlineTail: fields.text({
    label: "Heading (after accent)",
  }),
  subheading: fields.text({
    label: "Subheading",
  }),
  primaryButtonText: fields.text({
    label: "Primary Button Text",
  }),
  primaryButtonUrl: fields.link({
    label: "Primary Button URL",
  }),
  secondaryButtonText: fields.text({
    label: "Secondary Button Text",
  }),
  secondaryButtonUrl: fields.link({
    label: "Secondary Button URL",
  }),
  trustNote: fields.text({
    label: "Trust Line (mono)",
  }),

  showScene: fields.boolean({
    label: "Show Animated Scene",
    defaultValue: true,
    localized: false,
  }),

  siteBrand: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Brand",
    localized: false,
  }),
  siteDomain: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Domain",
    localized: false,
  }),
  siteNav: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Nav (· separated)",
  }),
  siteHeadline: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Starting Headline",
  }),
  siteButton: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Demo Site Starting Button",
  }),
  productName: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Product Name",
    localized: false,
  }),
  productPrice: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Product Price",
  }),
  productVariants: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Product Variants (Name:#hex · separated)",
  }),
  modelName: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Content Model Name",
    localized: false,
  }),
  modelFields: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Model Fields (name:Type · separated)",
    localized: false,
  }),
  adminLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Admin Tab Label",
    localized: false,
  }),
  adminNav: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Admin Sidebar (· separated)",
  }),
  recordCount: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Model Record Count",
  }),
  addFieldLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Add Field Button",
  }),
  addVariantLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Add Variant Button",
  }),
  savedLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Saved Toast",
  }),
  queryStatus: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: API Response Status",
    localized: false,
  }),
  agentName: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Agent Name",
    localized: false,
  }),
  chatTitle: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Chat Title",
  }),
  thinkingLabel: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Thinking Label",
  }),
  composerPlaceholder: fields.text({
    showWhen: SCENE_ON,
    label: "Scene: Chat Input Placeholder",
  }),
  steps: fields.repeater({
    showWhen: SCENE_ON,
    label: "Scene: Edits (played in a loop)",
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
