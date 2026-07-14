import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const featuresProps = {
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
    "Grid of product features with icons and copy; a supporting section below the hero.",
  component: Component,
  props: featuresProps,
});
