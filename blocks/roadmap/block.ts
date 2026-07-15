import { defineBlock, fields } from "@cmssy/react";
import Roadmap from "./Roadmap";

export const roadmapProps = {
    badge: fields.text({ label: "Badge Text", defaultValue: "Roadmap" }),
    heading: fields.text({ label: "Heading", defaultValue: "Product" }),
    headingHighlight: fields.text({
      label: "Heading Highlight",
      defaultValue: "Roadmap",
    }),
    description: fields.textarea({
      label: "Description",
      defaultValue:
        "Transparency is one of our core values. Here's what we're working on and what's coming next.",
    }),
    columns: fields.repeater({
      label: "Columns",
      itemSchema: {
        title: fields.text({ label: "Column Title", required: true }),
        status: fields.select({
          label: "Status Type",
          defaultValue: "planned",
          options: ["completed", "in_progress", "planned", "considering"],
        }),
        items: fields.repeater({
          label: "Items",
          itemSchema: {
            title: fields.text({ label: "Title", required: true }),
            description: fields.text({ label: "Description" }),
            badge: fields.text({ label: "Badge (optional)" }),
          },
        }),
      },
    }),
    showCta: fields.boolean({ label: "Show Feedback CTA", defaultValue: true }),
    ctaTitle: fields.text({
      label: "CTA Title",
      defaultValue: "Shape Our Roadmap",
    }),
    ctaDescription: fields.textarea({
      label: "CTA Description",
      defaultValue:
        "Have a feature request or idea? We'd love to hear from you.",
    }),
    ctaButtonText: fields.text({
      label: "CTA Button Text",
      defaultValue: "Submit Feedback",
    }),
    ctaButtonUrl: fields.link({
      label: "CTA Button URL",
      defaultValue: "/contact",
    }),
};

export const roadmapBlock = defineBlock({
  type: "roadmap",
  category: "Marketing",
  label: "Roadmap",
  description:
    "Product roadmap of planned, in-progress and shipped items; for a roadmap or updates page.",
  component: Roadmap,
  props: roadmapProps,
});
