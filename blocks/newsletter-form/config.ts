import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Newsletter Form",
  description: "Simple newsletter signup form for email marketing",
  category: "marketing",
  tags: ["newsletter", "form", "email", "marketing"],

  useClient: true,
  schema: {
    // Header section
    heading: field({
      type: "singleLine",
      label: "Heading",
      defaultValue: "Stay in the loop",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      defaultValue:
        "Get the latest updates, tips, and exclusive content delivered straight to your inbox.",
    }),

    // Form settings
    showNameField: field({
      type: "boolean",
      label: "Show Name Field",
      defaultValue: false,
      group: "Form Settings",
    }),
    namePlaceholder: field({
      type: "singleLine",
      label: "Name Placeholder",
      defaultValue: "Your name",
      group: "Form Settings",
    }),
    emailPlaceholder: field({
      type: "singleLine",
      label: "Email Placeholder",
      defaultValue: "you@example.com",
      group: "Form Settings",
    }),
    submitButtonText: field({
      type: "singleLine",
      label: "Submit Button Text",
      defaultValue: "Subscribe",
      group: "Form Settings",
    }),
    submitLoadingText: field({
      type: "singleLine",
      label: "Submit Loading Text",
      defaultValue: "Subscribing...",
      group: "Form Settings",
    }),

    // Tags for segmentation
    tags: field({
      type: "repeater",
      label: "Subscriber Tags",
      group: "Marketing",
      schema: {
        tag: field({
          type: "singleLine",
          label: "Tag",
          placeholder: "e.g., newsletter, blog-updates",
        }),
      },
    }),

    // Messages
    successHeading: field({
      type: "singleLine",
      label: "Success Heading",
      defaultValue: "You're subscribed!",
      group: "Messages",
    }),
    successMessage: field({
      type: "multiLine",
      label: "Success Message",
      defaultValue:
        "Thanks for subscribing! Check your inbox for a confirmation email.",
      group: "Messages",
    }),
    errorMessage: field({
      type: "multiLine",
      label: "Error Message",
      defaultValue: "Something went wrong. Please try again.",
      group: "Messages",
    }),

    // Styling
    variant: field({
      type: "select",
      label: "Variant",
      options: [
        { value: "inline", label: "Inline (horizontal)" },
        { value: "stacked", label: "Stacked (vertical)" },
        { value: "card", label: "Card with background" },
      ],
      defaultValue: "inline",
      group: "Styling",
    }),
    showPrivacyNote: field({
      type: "boolean",
      label: "Show Privacy Note",
      defaultValue: true,
      group: "Styling",
    }),
    privacyNote: field({
      type: "singleLine",
      label: "Privacy Note Text",
      defaultValue: "We respect your privacy. Unsubscribe at any time.",
      group: "Styling",
    }),
  },
});
