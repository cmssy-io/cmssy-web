import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const featuresBlock = defineBlock({
  type: "features",
  label: "Features",
  description: "Grid of product features with icons and copy; a supporting section below the hero.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Heading", required: true }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "Highlight" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Description", placeholder: "Enter description" }),
    "features": fields.repeater({ label: "Features", itemSchema: {
      "title": fields.singleLine({ label: "Title", defaultValue: "Feature Title", required: true }),
      "description": fields.multiLine({ label: "Description", defaultValue: "Feature description goes here.", required: true }),
      "color": fields.color({ label: "Color" }),
      "hoverColor": fields.color({ label: "Hover Color" }),
      "icon": fields.select({ label: "Icon", options: ["ZapIcon","SparklesIcon","GlobeAltIcon","LayersIcon","PaintBrushIcon","LightningBoltIcon","CloudIcon","LockClosedIcon","CogIcon","ChartBarIcon","DeviceMobileIcon","UsersIcon","ShieldCheckIcon","BlocksIcon"] })
    } })
  },
});
