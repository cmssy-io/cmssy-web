import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const changelogBlock = defineBlock({
  type: "changelog",
  label: "Changelog",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "badge": fields.singleLine({ label: "Badge Text", defaultValue: "Changelog" }),
    "heading": fields.singleLine({ label: "Heading", defaultValue: "What's" }),
    "headingHighlight": fields.singleLine({ label: "Heading Highlight", defaultValue: "New" }),
    "description": fields.multiLine({ label: "Description", defaultValue: "Stay up to date with the latest features, improvements, and fixes." }),
    "entries": fields.repeater({ label: "Changelog Entries", itemSchema: {
      "version": fields.singleLine({ label: "Version", required: true }),
      "date": fields.singleLine({ label: "Date", required: true }),
      "title": fields.singleLine({ label: "Title", required: true }),
      "type": fields.select({ label: "Type", defaultValue: "feature", options: ["feature","improvement","bugfix"] }),
      "changes": fields.repeater({ label: "Changes", itemSchema: {
        "text": fields.singleLine({ label: "Change Description", required: true })
      } })
    } }),
    "showSubscribe": fields.boolean({ label: "Show Subscribe CTA", defaultValue: true }),
    "subscribeText": fields.singleLine({ label: "Subscribe Text", defaultValue: "Subscribe to get notified about new releases" }),
    "subscribeButtonText": fields.singleLine({ label: "Subscribe Button Text", defaultValue: "Subscribe" }),
    "subscribeButtonUrl": fields.link({ label: "Subscribe Button URL", defaultValue: "/blog" })
  },
});
