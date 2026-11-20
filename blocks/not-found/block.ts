import { defineBlock, fields } from "@cmssy/react";
import NotFound from "./NotFound";

export const notFoundProps = {
    heading: fields.text({
      label: "Heading",
placeholder: "e.g., 404, Oops!, Lost?",
    }),
    title: fields.text({ label: "Title" }),
    description: fields.textarea({
      label: "Description",
    }),
    primaryButtonText: fields.text({
      label: "Primary Button Text",
    }),
    primaryButtonUrl: fields.link({
      label: "Primary Button URL",
    }),
    secondaryButtonText: fields.text({
      label: "Secondary Button Text",
    }),
    secondaryButtonUrl: fields.link({
      label: "Secondary Button URL",
    }),
};

export const notFoundBlock = defineBlock({
  type: "not-found",
  category: "Content",
  label: "404 Not Found",
  description: "404 error content; for a not-found page.",
  component: NotFound,
  props: notFoundProps,
});
