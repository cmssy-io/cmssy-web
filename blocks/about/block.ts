import { defineBlock, fields } from "@cmssy/react";
import About from "./About";

export const aboutProps = {
  badgeText: fields.text({ label: "Badge Text" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Building the Future of",
    required: true,
  }),
  headingHighlight: fields.text({
    label: "Heading Highlight",
  }),
  subtitle: fields.textarea({
    label: "Subtitle",
  }),
  missionHeading: fields.text({
    label: "Mission Heading",
  }),
  missionText: fields.textarea({
    label: "Mission Text",
  }),
  valuesHeading: fields.text({
    label: "Values Heading",
  }),
  values: fields.repeater({
    label: "Values",
    itemSchema: {
      icon: fields.select({
        label: "Icon",
options: [
          "sparkles",
          "heart",
          "users",
          "zap",
          "globe",
          "code",
          "shield",
          "rocket",
        ],
      }),
      title: fields.text({ label: "Title", required: true }),
      description: fields.textarea({ label: "Description" }),
    },
  }),
  techStackHeading: fields.text({
    label: "Tech Stack Heading",
  }),
  showTechStack: fields.boolean({
    label: "Show Tech Stack",
  }),
  techStack: fields.repeater({
    label: "Technologies",
    itemSchema: {
      name: fields.text({ label: "Name", required: true }),
      category: fields.text({ label: "Category" }),
    },
  }),
};

export const aboutBlock = defineBlock({
  type: "about",
  category: "Marketing",
  label: "About",
  description:
    "Company or team story section introducing who you are; mid-page on an about or home page.",
  component: About,
  props: aboutProps,
});
