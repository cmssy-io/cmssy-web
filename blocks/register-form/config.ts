import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Register Form",
  description: "Customer registration form for account creation",
  category: "marketing",
  tags: ["register", "signup", "auth", "form", "customer"],

  useClient: true,
  schema: {
    // Header section
    heading: field({
      type: "singleLine",
      label: "Heading",
      defaultValue: "Create an account",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      defaultValue: "Sign up to get started with your account.",
    }),

    // Form settings
    firstNameLabel: field({
      type: "singleLine",
      label: "First Name Label",
      defaultValue: "First name",
      group: "Form Settings",
    }),
    lastNameLabel: field({
      type: "singleLine",
      label: "Last Name Label",
      defaultValue: "Last name",
      group: "Form Settings",
    }),
    emailLabel: field({
      type: "singleLine",
      label: "Email Label",
      defaultValue: "Email",
      group: "Form Settings",
    }),
    passwordLabel: field({
      type: "singleLine",
      label: "Password Label",
      defaultValue: "Password",
      group: "Form Settings",
    }),
    confirmPasswordLabel: field({
      type: "singleLine",
      label: "Confirm Password Label",
      defaultValue: "Confirm password",
      group: "Form Settings",
    }),
    passwordHelpText: field({
      type: "singleLine",
      label: "Password Help Text",
      defaultValue: "Must be at least {min} characters",
      helpText: "Use {min} for minimum length",
      group: "Form Settings",
    }),
    showNameFields: field({
      type: "boolean",
      label: "Show Name Fields",
      defaultValue: true,
      group: "Form Settings",
    }),
    firstNamePlaceholder: field({
      type: "singleLine",
      label: "First Name Placeholder",
      defaultValue: "First name",
      group: "Form Settings",
    }),
    lastNamePlaceholder: field({
      type: "singleLine",
      label: "Last Name Placeholder",
      defaultValue: "Last name",
      group: "Form Settings",
    }),
    emailPlaceholder: field({
      type: "singleLine",
      label: "Email Placeholder",
      defaultValue: "you@example.com",
      group: "Form Settings",
    }),
    passwordPlaceholder: field({
      type: "singleLine",
      label: "Password Placeholder",
      defaultValue: "Create a password",
      group: "Form Settings",
    }),
    confirmPasswordPlaceholder: field({
      type: "singleLine",
      label: "Confirm Password Placeholder",
      defaultValue: "Confirm your password",
      group: "Form Settings",
    }),
    submitButtonText: field({
      type: "singleLine",
      label: "Submit Button Text",
      defaultValue: "Create account",
      group: "Form Settings",
    }),
    submitLoadingText: field({
      type: "singleLine",
      label: "Submit Loading Text",
      defaultValue: "Creating account...",
      group: "Form Settings",
    }),
    minPasswordLength: field({
      type: "numeric",
      label: "Minimum Password Length",
      defaultValue: 8,
      group: "Form Settings",
    }),

    // Terms & Privacy
    termsPrefix: field({
      type: "singleLine",
      label: "Terms Prefix",
      defaultValue: "I agree to the",
      group: "Terms",
    }),
    termsLinkText: field({
      type: "singleLine",
      label: "Terms Link Text",
      defaultValue: "Terms of Service",
      group: "Terms",
    }),
    termsConnector: field({
      type: "singleLine",
      label: "Terms Connector",
      defaultValue: "and",
      group: "Terms",
    }),
    privacyLinkText: field({
      type: "singleLine",
      label: "Privacy Link Text",
      defaultValue: "Privacy Policy",
      group: "Terms",
    }),
    showTerms: field({
      type: "boolean",
      label: "Show Terms Checkbox",
      defaultValue: true,
      group: "Terms",
    }),
    termsText: field({
      type: "singleLine",
      label: "Terms Text",
      defaultValue: "I agree to the Terms of Service and Privacy Policy",
      group: "Terms",
    }),
    termsUrl: field({
      type: "link",
      label: "Terms URL",
      defaultValue: "/terms",
      group: "Terms",
    }),
    privacyUrl: field({
      type: "link",
      label: "Privacy Policy URL",
      defaultValue: "/privacy",
      group: "Terms",
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
      defaultValue: "Already have an account? Sign in",
      group: "Links",
    }),
    loginUrl: field({
      type: "link",
      label: "Login URL",
      defaultValue: "/login",
      group: "Links",
    }),

    // Redirect
    redirectAfterRegister: field({
      type: "link",
      label: "Redirect After Register",
      defaultValue: "/verify-email-pending",
      group: "Redirect",
    }),

    // Messages
    successHeading: field({
      type: "singleLine",
      label: "Success Heading",
      defaultValue: "Check your email",
      group: "Messages",
    }),
    successLoginLinkText: field({
      type: "singleLine",
      label: "Success Login Link Text",
      defaultValue: "Go to login",
      group: "Messages",
    }),
    passwordTooShortMessage: field({
      type: "singleLine",
      label: "Password Too Short Message",
      defaultValue: "Password must be at least {min} characters.",
      helpText: "Use {min} for minimum length",
      group: "Messages",
    }),
    termsRequiredMessage: field({
      type: "singleLine",
      label: "Terms Required Message",
      defaultValue: "Please accept the terms and conditions.",
      group: "Messages",
    }),
    successMessage: field({
      type: "multiLine",
      label: "Success Message",
      defaultValue: "Account created! Please check your email to verify your account.",
      group: "Messages",
    }),
    errorMessage: field({
      type: "multiLine",
      label: "Default Error Message",
      defaultValue: "Something went wrong. Please try again.",
      group: "Messages",
    }),
    passwordMismatchMessage: field({
      type: "singleLine",
      label: "Password Mismatch Message",
      defaultValue: "Passwords do not match.",
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
