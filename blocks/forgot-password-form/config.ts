import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Forgot Password Form",
  description: "Password reset request form for customers",
  category: "marketing",
  tags: ["password", "reset", "auth", "form", "customer"],

  useClient: true,
  schema: {
    // Header section
    heading: field({
      type: "singleLine",
      label: "Heading",
      defaultValue: "Forgot your password?",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      defaultValue: "Enter your email address and we'll send you a link to reset your password.",
    }),

    // Form settings
    emailLabel: field({
      type: "singleLine",
      label: "Email Label",
      defaultValue: "Email",
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
      defaultValue: "Send reset link",
      group: "Form Settings",
    }),
    submitLoadingText: field({
      type: "singleLine",
      label: "Submit Loading Text",
      defaultValue: "Sending...",
      group: "Form Settings",
    }),

    // Links
    showLoginLink: field({
      type: "boolean",
      label: "Show Login Link",
      defaultValue: true,
      group: "Links",
    }),
    loginLinkText: field({
      type: "singleLine",
      label: "Login Link Text",
      defaultValue: "Back to login",
      group: "Links",
    }),
    loginUrl: field({
      type: "link",
      label: "Login URL",
      defaultValue: "/login",
      group: "Links",
    }),

    // Messages
    successHeading: field({
      type: "singleLine",
      label: "Success Heading",
      defaultValue: "Check your email",
      group: "Messages",
    }),
    emailSentText: field({
      type: "singleLine",
      label: "Email Sent Text",
      defaultValue: "We sent an email to",
      group: "Messages",
    }),
    successMessage: field({
      type: "multiLine",
      label: "Success Message",
      defaultValue: "If an account exists with this email, you will receive a password reset link shortly.",
      group: "Messages",
    }),
    errorMessage: field({
      type: "multiLine",
      label: "Default Error Message",
      defaultValue: "Something went wrong. Please try again.",
      group: "Messages",
    }),

    // Styling
    variant: field({
      type: "select",
      label: "Variant",
      options: [
        { value: "default", label: "Default" },
        { value: "card", label: "Card with background" },
      ],
      defaultValue: "default",
      group: "Styling",
    }),
  },
});
