import { defineBlock, fields } from "@cmssy/react";
import Contact from "./Contact";

export const contactProps = {
    badgeText: fields.text({ label: "Badge Text" }),
    heading: fields.text({ label: "Heading" }),
    headingHighlight: fields.text({
      label: "Heading Highlight",
    }),
    description: fields.textarea({
      label: "Description",
    }),
    infoCards: fields.repeater({
      label: "Info Cards",
itemSchema: {
        icon: fields.select({
          label: "Icon",
          options: ["mail", "clock", "map-pin", "phone", "chat", "globe"],
        }),
        title: fields.text({ label: "Title" }),
        description: fields.textarea({ label: "Description" }),
      },
    }),
    showQuote: fields.boolean({ label: "Show Quote" }),
    quoteText: fields.textarea({
      label: "Quote Text",
    }),
    quoteAuthor: fields.text({
      label: "Quote Author",
    }),
    formId: fields.form({ label: "Form", tab: "advanced" }),
    headingLevel: fields.select({
      label: "Heading Level",
options: ["h1", "h2"],
      tab: "advanced",
    }),
    submitLoadingText: fields.text({
      label: "Submit Loading Text",
    }),
    successHeading: fields.text({
      label: "Success Heading",
    }),
};

export const contactBlock = defineBlock({
  type: "contact",
  category: "Forms",
  label: "Contact",
  description:
    "Contact details and/or contact form; near the end of a page or on a dedicated contact page.",
  component: Contact,
  props: contactProps,
});
