import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const forgotPasswordFormBlock = defineBlock({
  type: "forgot-password-form",
  label: "Forgot Password Form",
  description: "Password-reset request form; for a forgot-password auth page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Forgot your password?" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Enter your email address and we'll send you a link to reset your password." }),
    "emailLabel": fields.singleLine({ label: "Email Label", defaultValue: "Email" }),
    "emailPlaceholder": fields.singleLine({ label: "Email Placeholder", defaultValue: "you@example.com" }),
    "submitButtonText": fields.singleLine({ label: "Submit Button Text", defaultValue: "Send reset link" }),
    "submitLoadingText": fields.singleLine({ label: "Submit Loading Text", defaultValue: "Sending..." }),
    "showLoginLink": fields.boolean({ label: "Show Login Link", defaultValue: true }),
    "loginLinkText": fields.singleLine({ label: "Login Link Text", defaultValue: "Back to login" }),
    "loginUrl": fields.link({ label: "Login URL", defaultValue: "/login" }),
    "successHeading": fields.singleLine({ label: "Success Heading", defaultValue: "Check your email" }),
    "emailSentText": fields.singleLine({ label: "Email Sent Text", defaultValue: "We sent an email to" }),
    "successMessage": fields.multiLine({ label: "Success Message", defaultValue: "If an account exists with this email, you will receive a password reset link shortly." }),
    "errorMessage": fields.multiLine({ label: "Default Error Message", defaultValue: "Something went wrong. Please try again." }),
    "variant": fields.select({ label: "Variant", defaultValue: "default", options: ["default","card"] })
  },
});
