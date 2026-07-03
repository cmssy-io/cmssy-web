import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const loginFormBlock = defineBlock({
  type: "login-form",
  label: "Login Form",
  description: "Sign-in form with email and password; for a login auth page.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Welcome back" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Sign in to your account to continue." }),
    "emailLabel": fields.singleLine({ label: "Email Label", defaultValue: "Email" }),
    "emailPlaceholder": fields.singleLine({ label: "Email Placeholder", defaultValue: "you@example.com" }),
    "passwordLabel": fields.singleLine({ label: "Password Label", defaultValue: "Password" }),
    "passwordPlaceholder": fields.singleLine({ label: "Password Placeholder", defaultValue: "Enter your password" }),
    "submitButtonText": fields.singleLine({ label: "Submit Button Text", defaultValue: "Sign in" }),
    "submitLoadingText": fields.singleLine({ label: "Submit Loading Text", defaultValue: "Signing in..." }),
    "showRememberMe": fields.boolean({ label: "Show Remember Me", defaultValue: true }),
    "rememberMeLabel": fields.singleLine({ label: "Remember Me Label", defaultValue: "Remember me" }),
    "showForgotPassword": fields.boolean({ label: "Show Forgot Password Link", defaultValue: true }),
    "forgotPasswordText": fields.singleLine({ label: "Forgot Password Text", defaultValue: "Forgot your password?" }),
    "forgotPasswordUrl": fields.link({ label: "Forgot Password URL", defaultValue: "/forgot-password" }),
    "showRegisterLink": fields.boolean({ label: "Show Register Link", defaultValue: true }),
    "registerLinkText": fields.singleLine({ label: "Register Link Text", defaultValue: "Don't have an account? Sign up" }),
    "registerUrl": fields.link({ label: "Register URL", defaultValue: "/register" }),
    "redirectAfterLogin": fields.link({ label: "Redirect After Login", defaultValue: "/" }),
    "successMessage": fields.multiLine({ label: "Success Message", defaultValue: "Login successful! Redirecting..." }),
    "errorMessage": fields.multiLine({ label: "Default Error Message", defaultValue: "Invalid email or password. Please try again." }),
    "variant": fields.select({ label: "Variant", defaultValue: "default", options: ["default","card"] })
  },
});
