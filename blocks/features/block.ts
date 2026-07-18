import { defineBlock, fields } from "@cmssy/react";
import Features from "./Features";

export const featuresProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 4.0" }),
  eyebrow: fields.text({ label: "Eyebrow", defaultValue: "BUILT IN, NOT BOLTED ON" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Heading",
    required: true,
  }),
  headingHighlight: fields.text({
    label: "Heading Highlight",
    defaultValue: "Highlight",
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue: "Description",
    placeholder: "Enter description",
  }),
  features: fields.repeater({
    label: "Features",
    itemSchema: {
      title: fields.text({
        label: "Title",
        defaultValue: "Feature Title",
        required: true,
      }),
      description: fields.textarea({
        label: "Description",
        defaultValue: "Feature description goes here.",
        required: true,
      }),
      stat: fields.text({
        label: "Mono Stat",
        placeholder: "e.g. 15 field types",
      }),
      color: fields.color({ label: "Color" }),
      hoverColor: fields.color({ label: "Hover Color" }),
      icon: fields.select({
        label: "Icon",
        options: [
          "ZapIcon",
          "SparklesIcon",
          "GlobeAltIcon",
          "LayersIcon",
          "PaintBrushIcon",
          "LightningBoltIcon",
          "CloudIcon",
          "LockClosedIcon",
          "CogIcon",
          "ChartBarIcon",
          "DeviceMobileIcon",
          "UsersIcon",
          "ShieldCheckIcon",
          "BlocksIcon",
        ],
      }),
    },
  }),
};

export const featuresBlock = defineBlock({
  type: "features",
  category: "Marketing",
  label: "Features",
  description:
    "Spec-sheet grid of feature cards with a mono stat line each; a supporting section below the hero.",
  component: Features,
  props: featuresProps,
});
