import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const heroBlock = defineBlock({
  type: "hero",
  label: "Hero Section",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badgeText": fields.singleLine({ label: "Badge Text", defaultValue: "AI-Powered Page Builder", placeholder: "Badge Text" }),
    "heading": fields.singleLine({ label: "Main Heading", defaultValue: "Build reusable UI blocks with any framework", placeholder: "Build websites", required: true }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "without limits" }),
    "subheading": fields.multiLine({ label: "Subheading", placeholder: "The modern CMS that makes website creation effortless..." }),
    "primaryButtonText": fields.singleLine({ label: "Primary Button Text", defaultValue: "Start Building Free" }),
    "primaryButtonUrl": fields.link({ label: "Primary Button URL", defaultValue: "/signup" }),
    "secondaryButtonText": fields.singleLine({ label: "Secondary Button Text", defaultValue: "Watch Demo" }),
    "secondaryButtonUrl": fields.link({ label: "Secondary Button URL", defaultValue: "#demo" }),
    "socialProofPrefix": fields.singleLine({ label: "Social Proof Prefix", defaultValue: "Join" }),
    "socialProofCount": fields.singleLine({ label: "Social Proof Count", defaultValue: "2,000+" }),
    "socialProofText": fields.singleLine({ label: "Social Proof Text", defaultValue: "creators already building with cmssy" }),
    "media": fields.media({ label: "Media (Image or Video)", placeholder: "Upload an image or video for the hero section" }),
    "mediaPlaceholderHeading": fields.singleLine({ label: "Media Placeholder Heading", defaultValue: "Page Builder Preview" }),
    "mediaPlaceholderText": fields.singleLine({ label: "Media Placeholder Text", defaultValue: "Drag & drop interface with real-time preview" }),
    "test": fields.singleLine({ label: "Test Field", placeholder: "This is a test field" })
  },
});
