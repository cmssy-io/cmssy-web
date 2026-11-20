import { defineBlock, fields } from "@cmssy/react";
import AiDifferentiator from "./AiDifferentiator";

export const aiDifferentiatorProps = {
  fig: fields.text({ label: "Fig Number" }),
  eyebrow: fields.text({
    label: "Eyebrow",
  }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "AI that edits your content. Never code you paste.",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
  }),
  bullets: fields.repeater({
    label: "Bullets",
    itemSchema: {
      strong: fields.text({ label: "Bold Lead", required: true }),
      rest: fields.text({ label: "Rest of Sentence" }),
    },
  }),
  linkLabel: fields.text({
    label: "Link Label",
  }),
  linkUrl: fields.text({ label: "Link URL" }),
  chatUser: fields.text({
    label: "Chat: User Message",
  }),
  chatReply: fields.text({
    label: "Chat: Assistant Reply",
  }),
  chatTools: fields.repeater({
    label: "Chat: Tool Calls",
    itemSchema: {
      call: fields.text({ label: "Tool Call", required: true }),
    },
  }),
  chatBadge: fields.text({
    label: "Chat: Badge",
  }),
};

export const aiDifferentiatorBlock = defineBlock({
  type: "ai-differentiator",
  category: "Marketing",
  label: "AI Differentiator",
  description:
    "Dark two-column section: AI/MCP pitch with square bullets on the left, static Claude chat mockup with tool-call log on the right.",
  component: AiDifferentiator,
  props: aiDifferentiatorProps,
});
