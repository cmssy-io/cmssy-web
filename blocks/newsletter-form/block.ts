import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const newsletterFormBlock = defineBlock({
  type: "newsletter-form",
  label: "Newsletter Form",
  description: "Email newsletter signup; a supporting section or footer strip to capture subscribers.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "heading": fields.text({ label: "Heading", defaultValue: "Stay in the loop" }),
    "description": fields.textarea({ label: "Description", defaultValue: "Get the latest updates, tips, and exclusive content delivered straight to your inbox." }),
    "showNameField": fields.boolean({ label: "Show Name Field", defaultValue: false }),
    "namePlaceholder": fields.text({ label: "Name Placeholder", defaultValue: "Your name" }),
    "emailPlaceholder": fields.text({ label: "Email Placeholder", defaultValue: "you@example.com" }),
    "submitButtonText": fields.text({ label: "Submit Button Text", defaultValue: "Subscribe" }),
    "submitLoadingText": fields.text({ label: "Submit Loading Text", defaultValue: "Subscribing..." }),
    "tags": fields.repeater({ label: "Subscriber Tags", itemSchema: {
      "tag": fields.text({ label: "Tag", placeholder: "e.g., newsletter, blog-updates" })
    } }),
    "successHeading": fields.text({ label: "Success Heading", defaultValue: "You're subscribed!" }),
    "successMessage": fields.textarea({ label: "Success Message", defaultValue: "Thanks for subscribing! Check your inbox for a confirmation email." }),
    "errorMessage": fields.textarea({ label: "Error Message", defaultValue: "Something went wrong. Please try again." }),
    "variant": fields.select({ label: "Variant", defaultValue: "inline", options: ["inline","stacked","card"] }),
    "showPrivacyNote": fields.boolean({ label: "Show Privacy Note", defaultValue: true }),
    "privacyNote": fields.text({ label: "Privacy Note Text", defaultValue: "We respect your privacy. Unsubscribe at any time." })
  },
});
