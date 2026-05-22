import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Login Form",
  description: "Customer login form with email and password authentication",
  category: "marketing",
  tags: ["login", "auth", "form", "customer"],

  useClient: true,
  schema: {
    // Header section
    heading: field({
      type: "singleLine",
      label: "Heading",
      defaultValue: "Welcome back",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      defaultValue: "Sign in to your account to continue.",
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
    passwordLabel: field({
      type: "singleLine",
      label: "Password Label",
      defaultValue: "Password",
      group: "Form Settings",
    }),
    passwordPlaceholder: field({
      type: "singleLine",
      label: "Password Placeholder",
      defaultValue: "Enter your password",
      group: "Form Settings",
    }),
    submitButtonText: field({
      type: "singleLine",
      label: "Submit Button Text",
      defaultValue: "Sign in",
      group: "Form Settings",
    }),
    submitLoadingText: field({
      type: "singleLine",
      label: "Submit Loading Text",
      defaultValue: "Signing in...",
      group: "Form Settings",
    }),
    showRememberMe: field({
      type: "boolean",
      label: "Show Remember Me",
      defaultValue: true,
      group: "Form Settings",
    }),
    rememberMeLabel: field({
      type: "singleLine",
      label: "Remember Me Label",
      defaultValue: "Remember me",
      group: "Form Settings",
    }),

    // Links
    showForgotPassword: field({
      type: "boolean",
      label: "Show Forgot Password Link",
      defaultValue: true,
      group: "Links",
    }),
    forgotPasswordText: field({
      type: "singleLine",
      label: "Forgot Password Text",
      defaultValue: "Forgot your password?",
      group: "Links",
    }),
    forgotPasswordUrl: field({
      type: "link",
      label: "Forgot Password URL",
      defaultValue: "/forgot-password",
      group: "Links",
    }),
    showRegisterLink: field({
      type: "boolean",
      label: "Show Register Link",
      defaultValue: true,
      group: "Links",
    }),
    registerLinkText: field({
      type: "singleLine",
      label: "Register Link Text",
      defaultValue: "Don't have an account? Sign up",
      group: "Links",
    }),
    registerUrl: field({
      type: "link",
      label: "Register URL",
      defaultValue: "/register",
      group: "Links",
    }),

    // Redirect
    redirectAfterLogin: field({
      type: "link",
      label: "Redirect After Login",
      defaultValue: "/",
      group: "Redirect",
    }),

    // Messages
    successMessage: field({
      type: "multiLine",
      label: "Success Message",
      defaultValue: "Login successful! Redirecting...",
      group: "Messages",
    }),
    errorMessage: field({
      type: "multiLine",
      label: "Default Error Message",
      defaultValue: "Invalid email or password. Please try again.",
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
