import { defineBlock, fields } from "@cmssy/react";
import AiDifferentiator from "./AiDifferentiator";

export const aiDifferentiatorProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 2.0" }),
  eyebrow: fields.text({
    label: "Eyebrow",
    defaultValue: "THE DIFFERENTIATOR",
  }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "AI that edits your content. Never code you paste.",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "Connect Claude through cmssy's MCP server and it works inside your workspace — creating pages, writing copy, and translating. It edits structured content directly, so nothing lands in your repo unreviewed.",
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
    defaultValue: "Read the MCP docs →",
  }),
  linkUrl: fields.text({ label: "Link URL", defaultValue: "/docs/mcp-server" }),
  chatUser: fields.text({
    label: "Chat: User Message",
    defaultValue: "Add a pricing section in German to the home page.",
  }),
  chatReply: fields.text({
    label: "Chat: Assistant Reply",
    defaultValue:
      "Done. I created a pricing block, added German copy, and published.",
  }),
  chatTools: fields.repeater({
    label: "Chat: Tool Calls",
    itemSchema: {
      call: fields.text({ label: "Tool Call", required: true }),
    },
  }),
  chatBadge: fields.text({
    label: "Chat: Badge",
    defaultValue: "No redeploy · content-only change",
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
