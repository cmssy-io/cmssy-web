import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Faq",
  description: "",
  category: "marketing",
  tags: ["marketing", "faq"],

  useClient: true,
  schema: {
    heading: field({
      type: "singleLine",
      label: "Heading",
      required: true,
      defaultValue: "Heading",
    }),
    headingHighlight: field({
      type: "singleLine",
      label: "Heading Highlight",
      defaultValue: "Highlight",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      placeholder: "Enter description",
      defaultValue: "Description",
    }),
    faqs: field({
      type: "repeater",
      label: "FAQs",
      schema: {
        question: field({
          type: "singleLine",
          label: "Question",
          required: true,
          defaultValue: "What is your refund policy?",
        }),
        answer: field({
          type: "multiLine",
          label: "Answer",
          required: true,
          defaultValue:
            "We offer a 30-day money-back guarantee. If you're not satisfied with our product, simply contact our support team within 30 days of purchase for a full refund.",
        }),
      },
    }),
  },
});
