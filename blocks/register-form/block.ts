import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const registerFormBlock = defineBlock({
  type: "register-form",
  label: "Register Form",
  description: "Account registration and signup form; for a register auth page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.text({ label: "Heading", defaultValue: "Create an account" }),
    "description": fields.textarea({ label: "Description", defaultValue: "Sign up to get started with your account." }),
    "firstNameLabel": fields.text({ label: "First Name Label", defaultValue: "First name" }),
    "lastNameLabel": fields.text({ label: "Last Name Label", defaultValue: "Last name" }),
    "emailLabel": fields.text({ label: "Email Label", defaultValue: "Email" }),
    "passwordLabel": fields.text({ label: "Password Label", defaultValue: "Password" }),
    "confirmPasswordLabel": fields.text({ label: "Confirm Password Label", defaultValue: "Confirm password" }),
    "passwordHelpText": fields.text({ label: "Password Help Text", defaultValue: "Must be at least {min} characters" }),
    "showNameFields": fields.boolean({ label: "Show Name Fields", defaultValue: true }),
    "firstNamePlaceholder": fields.text({ label: "First Name Placeholder", defaultValue: "First name" }),
    "lastNamePlaceholder": fields.text({ label: "Last Name Placeholder", defaultValue: "Last name" }),
    "emailPlaceholder": fields.text({ label: "Email Placeholder", defaultValue: "you@example.com" }),
    "passwordPlaceholder": fields.text({ label: "Password Placeholder", defaultValue: "Create a password" }),
    "confirmPasswordPlaceholder": fields.text({ label: "Confirm Password Placeholder", defaultValue: "Confirm your password" }),
    "submitButtonText": fields.text({ label: "Submit Button Text", defaultValue: "Create account" }),
    "submitLoadingText": fields.text({ label: "Submit Loading Text", defaultValue: "Creating account..." }),
    "minPasswordLength": fields.number({ label: "Minimum Password Length", defaultValue: 8 }),
    "termsPrefix": fields.text({ label: "Terms Prefix", defaultValue: "I agree to the" }),
    "termsLinkText": fields.text({ label: "Terms Link Text", defaultValue: "Terms of Service" }),
    "termsConnector": fields.text({ label: "Terms Connector", defaultValue: "and" }),
    "privacyLinkText": fields.text({ label: "Privacy Link Text", defaultValue: "Privacy Policy" }),
    "showTerms": fields.boolean({ label: "Show Terms Checkbox", defaultValue: true }),
    "termsText": fields.text({ label: "Terms Text", defaultValue: "I agree to the Terms of Service and Privacy Policy" }),
    "termsUrl": fields.link({ label: "Terms URL", defaultValue: "/terms" }),
    "privacyUrl": fields.link({ label: "Privacy Policy URL", defaultValue: "/privacy" }),
    "showLoginLink": fields.boolean({ label: "Show Login Link", defaultValue: true }),
    "loginLinkText": fields.text({ label: "Login Link Text", defaultValue: "Already have an account? Sign in" }),
    "loginUrl": fields.link({ label: "Login URL", defaultValue: "/login" }),
    "redirectAfterRegister": fields.link({ label: "Redirect After Register", defaultValue: "/verify-email-pending" }),
    "successHeading": fields.text({ label: "Success Heading", defaultValue: "Check your email" }),
    "successLoginLinkText": fields.text({ label: "Success Login Link Text", defaultValue: "Go to login" }),
    "passwordTooShortMessage": fields.text({ label: "Password Too Short Message", defaultValue: "Password must be at least {min} characters." }),
    "termsRequiredMessage": fields.text({ label: "Terms Required Message", defaultValue: "Please accept the terms and conditions." }),
    "successMessage": fields.textarea({ label: "Success Message", defaultValue: "Account created! Please check your email to verify your account." }),
    "errorMessage": fields.textarea({ label: "Default Error Message", defaultValue: "Something went wrong. Please try again." }),
    "passwordMismatchMessage": fields.text({ label: "Password Mismatch Message", defaultValue: "Passwords do not match." }),
    "variant": fields.select({ label: "Variant", defaultValue: "default", options: ["default","card"] })
  },
});
