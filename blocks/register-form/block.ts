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
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Create an account" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Sign up to get started with your account." }),
    "firstNameLabel": fields.singleLine({ label: "First Name Label", defaultValue: "First name" }),
    "lastNameLabel": fields.singleLine({ label: "Last Name Label", defaultValue: "Last name" }),
    "emailLabel": fields.singleLine({ label: "Email Label", defaultValue: "Email" }),
    "passwordLabel": fields.singleLine({ label: "Password Label", defaultValue: "Password" }),
    "confirmPasswordLabel": fields.singleLine({ label: "Confirm Password Label", defaultValue: "Confirm password" }),
    "passwordHelpText": fields.singleLine({ label: "Password Help Text", defaultValue: "Must be at least {min} characters" }),
    "showNameFields": fields.boolean({ label: "Show Name Fields", defaultValue: true }),
    "firstNamePlaceholder": fields.singleLine({ label: "First Name Placeholder", defaultValue: "First name" }),
    "lastNamePlaceholder": fields.singleLine({ label: "Last Name Placeholder", defaultValue: "Last name" }),
    "emailPlaceholder": fields.singleLine({ label: "Email Placeholder", defaultValue: "you@example.com" }),
    "passwordPlaceholder": fields.singleLine({ label: "Password Placeholder", defaultValue: "Create a password" }),
    "confirmPasswordPlaceholder": fields.singleLine({ label: "Confirm Password Placeholder", defaultValue: "Confirm your password" }),
    "submitButtonText": fields.singleLine({ label: "Submit Button Text", defaultValue: "Create account" }),
    "submitLoadingText": fields.singleLine({ label: "Submit Loading Text", defaultValue: "Creating account..." }),
    "minPasswordLength": fields.numeric({ label: "Minimum Password Length", defaultValue: 8 }),
    "termsPrefix": fields.singleLine({ label: "Terms Prefix", defaultValue: "I agree to the" }),
    "termsLinkText": fields.singleLine({ label: "Terms Link Text", defaultValue: "Terms of Service" }),
    "termsConnector": fields.singleLine({ label: "Terms Connector", defaultValue: "and" }),
    "privacyLinkText": fields.singleLine({ label: "Privacy Link Text", defaultValue: "Privacy Policy" }),
    "showTerms": fields.boolean({ label: "Show Terms Checkbox", defaultValue: true }),
    "termsText": fields.singleLine({ label: "Terms Text", defaultValue: "I agree to the Terms of Service and Privacy Policy" }),
    "termsUrl": fields.link({ label: "Terms URL", defaultValue: "/terms" }),
    "privacyUrl": fields.link({ label: "Privacy Policy URL", defaultValue: "/privacy" }),
    "showLoginLink": fields.boolean({ label: "Show Login Link", defaultValue: true }),
    "loginLinkText": fields.singleLine({ label: "Login Link Text", defaultValue: "Already have an account? Sign in" }),
    "loginUrl": fields.link({ label: "Login URL", defaultValue: "/login" }),
    "redirectAfterRegister": fields.link({ label: "Redirect After Register", defaultValue: "/verify-email-pending" }),
    "successHeading": fields.singleLine({ label: "Success Heading", defaultValue: "Check your email" }),
    "successLoginLinkText": fields.singleLine({ label: "Success Login Link Text", defaultValue: "Go to login" }),
    "passwordTooShortMessage": fields.singleLine({ label: "Password Too Short Message", defaultValue: "Password must be at least {min} characters." }),
    "termsRequiredMessage": fields.singleLine({ label: "Terms Required Message", defaultValue: "Please accept the terms and conditions." }),
    "successMessage": fields.multiLine({ label: "Success Message", defaultValue: "Account created! Please check your email to verify your account." }),
    "errorMessage": fields.multiLine({ label: "Default Error Message", defaultValue: "Something went wrong. Please try again." }),
    "passwordMismatchMessage": fields.singleLine({ label: "Password Mismatch Message", defaultValue: "Passwords do not match." }),
    "variant": fields.select({ label: "Variant", defaultValue: "default", options: ["default","card"] })
  },
});
