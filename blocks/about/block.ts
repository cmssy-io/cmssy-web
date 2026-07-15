import { defineBlock, fields } from "@cmssy/react";
import About from "./About";

export const aboutProps = {
  badgeText: fields.text({ label: "Badge Text", defaultValue: "About" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Building the Future of",
    required: true,
  }),
  headingHighlight: fields.text({
    label: "Heading Highlight",
    defaultValue: "CMS",
  }),
  subtitle: fields.textarea({
    label: "Subtitle",
    defaultValue:
      "We're on a mission to make professional website creation accessible to everyone, powered by AI and modern technology.",
  }),
  missionHeading: fields.text({
    label: "Mission Heading",
    defaultValue: "Our Mission",
  }),
  missionText: fields.textarea({
    label: "Mission Text",
    defaultValue:
      "We believe that creating beautiful, professional websites shouldn't require a team of developers or expensive agencies. Cmssy empowers creators, businesses, and developers to build stunning websites with AI-powered tools, intuitive drag-and-drop editing, and enterprise-grade performance.",
  }),
  valuesHeading: fields.text({
    label: "Values Heading",
    defaultValue: "Our Values",
  }),
  values: fields.repeater({
    label: "Values",
    itemSchema: {
      icon: fields.select({
        label: "Icon",
        defaultValue: "sparkles",
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
    defaultValue: "Built With Modern Tech",
  }),
  showTechStack: fields.boolean({
    label: "Show Tech Stack",
    defaultValue: true,
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
