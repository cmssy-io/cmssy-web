import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const aboutBlock = defineBlock({
  type: "about",
  label: "About",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badgeText": fields.singleLine({ label: "Badge Text", defaultValue: "About" }),
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Building the Future of", required: true }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "CMS" }),
    "subtitle": fields.multiLine({ label: "Subtitle", defaultValue: "We're on a mission to make professional website creation accessible to everyone, powered by AI and modern technology." }),
    "missionHeading": fields.singleLine({ label: "Mission Heading", defaultValue: "Our Mission" }),
    "missionText": fields.multiLine({ label: "Mission Text", defaultValue: "We believe that creating beautiful, professional websites shouldn't require a team of developers or expensive agencies. Cmssy empowers creators, businesses, and developers to build stunning websites with AI-powered tools, intuitive drag-and-drop editing, and enterprise-grade performance." }),
    "valuesHeading": fields.singleLine({ label: "Values Heading", defaultValue: "Our Values" }),
    "values": fields.repeater({ label: "Values", itemSchema: {
      "icon": fields.select({ label: "Icon", defaultValue: "sparkles", options: ["sparkles","heart","users","zap","globe","code","shield","rocket"] }),
      "title": fields.singleLine({ label: "Title", required: true }),
      "description": fields.multiLine({ label: "Description" })
    } }),
    "techStackHeading": fields.singleLine({ label: "Tech Stack Heading", defaultValue: "Built With Modern Tech" }),
    "showTechStack": fields.boolean({ label: "Show Tech Stack", defaultValue: true }),
    "techStack": fields.repeater({ label: "Technologies", itemSchema: {
      "name": fields.singleLine({ label: "Name", required: true }),
      "category": fields.singleLine({ label: "Category" })
    } })
  },
});
