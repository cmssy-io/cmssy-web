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
    "heading": fields.singleLine({ label: "Heading", defaultValue: "Stay in the loop" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Get the latest updates, tips, and exclusive content delivered straight to your inbox." }),
    "showNameField": fields.boolean({ label: "Show Name Field", defaultValue: false }),
    "namePlaceholder": fields.singleLine({ label: "Name Placeholder", defaultValue: "Your name" }),
    "emailPlaceholder": fields.singleLine({ label: "Email Placeholder", defaultValue: "you@example.com" }),
    "submitButtonText": fields.singleLine({ label: "Submit Button Text", defaultValue: "Subscribe" }),
    "submitLoadingText": fields.singleLine({ label: "Submit Loading Text", defaultValue: "Subscribing..." }),
    "tags": fields.repeater({ label: "Subscriber Tags", itemSchema: {
      "tag": fields.singleLine({ label: "Tag", placeholder: "e.g., newsletter, blog-updates" })
    } }),
    "successHeading": fields.singleLine({ label: "Success Heading", defaultValue: "You're subscribed!" }),
    "successMessage": fields.multiLine({ label: "Success Message", defaultValue: "Thanks for subscribing! Check your inbox for a confirmation email." }),
    "errorMessage": fields.multiLine({ label: "Error Message", defaultValue: "Something went wrong. Please try again." }),
    "variant": fields.select({ label: "Variant", defaultValue: "inline", options: ["inline","stacked","card"] }),
    "showPrivacyNote": fields.boolean({ label: "Show Privacy Note", defaultValue: true }),
    "privacyNote": fields.singleLine({ label: "Privacy Note Text", defaultValue: "We respect your privacy. Unsubscribe at any time." })
  },
});
