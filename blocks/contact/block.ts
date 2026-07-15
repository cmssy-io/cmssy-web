import { defineBlock, fields } from "@cmssy/react";
import Contact from "./Contact";

export const contactProps = {
    badgeText: fields.text({ label: "Badge Text", defaultValue: "Contact Us" }),
    heading: fields.text({ label: "Heading", defaultValue: "Let's" }),
    headingHighlight: fields.text({
      label: "Heading Highlight",
      defaultValue: "talk",
    }),
    description: fields.textarea({
      label: "Description",
      defaultValue:
        "Have a question, feedback, or just want to say hello? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
    }),
    infoCards: fields.repeater({
      label: "Info Cards",
      defaultValue: [
        {
          title: "Email Us",
          description:
            "Drop us a line anytime. We typically respond within 24 hours.",
        },
        {
          title: "Response Time",
          description:
            "We aim to respond to all inquiries within 24-48 hours during business days.",
        },
        {
          title: "Location",
          description: "We're a remote-first team working across Europe.",
        },
      ],
      itemSchema: {
        icon: fields.select({
          label: "Icon",
          options: ["mail", "clock", "map-pin", "phone", "chat", "globe"],
        }),
        title: fields.text({ label: "Title" }),
        description: fields.textarea({ label: "Description" }),
      },
    }),
    showQuote: fields.boolean({ label: "Show Quote", defaultValue: true }),
    quoteText: fields.textarea({
      label: "Quote Text",
      defaultValue:
        "Building the future of content management, one pixel at a time.",
    }),
    quoteAuthor: fields.text({
      label: "Quote Author",
      defaultValue: "The Cmssy Team",
    }),
    formId: fields.form({ label: "Form", tab: "advanced" }),
    submitLoadingText: fields.text({
      label: "Submit Loading Text",
      defaultValue: "Sending...",
    }),
    successHeading: fields.text({
      label: "Success Heading",
      defaultValue: "Message Sent!",
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
