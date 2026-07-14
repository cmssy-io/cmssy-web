import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const heroProps = {
  badgeText: fields.text({
    label: "Badge Text",
    defaultValue: "AI-Powered Page Builder",
    placeholder: "Badge Text",
  }),
  heading: fields.text({
    label: "Main Heading",
    defaultValue: "Build reusable UI blocks with any framework",
    placeholder: "Build websites",
    required: true,
  }),
  headingHighlight: fields.text({
    label: "Heading Highlight",
    defaultValue: "without limits",
  }),
  subheading: fields.textarea({
    label: "Subheading",
    placeholder: "The modern CMS that makes website creation effortless...",
  }),
  primaryButtonText: fields.text({
    label: "Primary Button Text",
    defaultValue: "Start Building Free",
  }),
  primaryButtonUrl: fields.link({
    label: "Primary Button URL",
    defaultValue: "/signup",
  }),
  secondaryButtonText: fields.text({
    label: "Secondary Button Text",
    defaultValue: "Watch Demo",
  }),
  secondaryButtonUrl: fields.link({
    label: "Secondary Button URL",
    defaultValue: "#demo",
  }),
  socialProofPrefix: fields.text({
    label: "Social Proof Prefix",
    defaultValue: "Join",
  }),
  socialProofCount: fields.text({
    label: "Social Proof Count",
    defaultValue: "2,000+",
  }),
  socialProofText: fields.text({
    label: "Social Proof Text",
    defaultValue: "creators already building with cmssy",
  }),
  media: fields.media({
    label: "Media (Image or Video)",
    placeholder: "Upload an image or video for the hero section",
  }),
  mediaPlaceholderHeading: fields.text({
    label: "Media Placeholder Heading",
    defaultValue: "Page Builder Preview",
  }),
  mediaPlaceholderText: fields.text({
    label: "Media Placeholder Text",
    defaultValue: "Drag & drop interface with real-time preview",
  }),
};

export const heroBlock = defineBlock({
  type: "hero",
  category: "Hero",
  label: "Hero Section",
  description:
    "Full-width top banner with headline, subheading and primary CTA; the first block on a landing or home page.",
  component: Component,
  props: heroProps,
});
