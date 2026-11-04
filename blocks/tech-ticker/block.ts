import { defineBlock, fields } from "@cmssy/react";
import TechTicker from "./TechTicker";

export const techTickerProps = {
  items: fields.repeater({
    label: "Items",
    itemSchema: {
      label: fields.text({ label: "Label", required: true }),
    },
  }),
  ariaLabel: fields.text({
    label: "Aria Label",
    placeholder: "Technologies we work with",
  }),
};

export const techTickerBlock = defineBlock({
  type: "tech-ticker",
  category: "Marketing",
  label: "Tech Ticker",
  description:
    "Slim ink band under the hero that scrolls technology names sideways in a continuous marquee.",
  component: TechTicker,
  props: techTickerProps,
});
