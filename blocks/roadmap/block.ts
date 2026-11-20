import { defineBlock, fields } from "@cmssy/react";
import Roadmap from "./Roadmap";

export const roadmapProps = {
    badge: fields.text({ label: "Badge Text" }),
    heading: fields.text({ label: "Heading" }),
    headingHighlight: fields.text({
      label: "Heading Highlight",
    }),
    description: fields.textarea({
      label: "Description",
    }),
    columns: fields.repeater({
      label: "Columns",
      itemSchema: {
        title: fields.text({ label: "Column Title", required: true }),
        status: fields.select({
          label: "Status Type",
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
    showCta: fields.boolean({ label: "Show Feedback CTA" }),
    ctaTitle: fields.text({
      label: "CTA Title",
    }),
    ctaDescription: fields.textarea({
      label: "CTA Description",
    }),
    ctaButtonText: fields.text({
      label: "CTA Button Text",
    }),
    ctaButtonUrl: fields.link({
      label: "CTA Button URL",
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
