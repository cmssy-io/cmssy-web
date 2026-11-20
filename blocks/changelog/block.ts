import { defineBlock, fields } from "@cmssy/react";
import Changelog from "./Changelog";

export const changelogProps = {
    "badge": fields.text({ label: "Badge Text" }),
    "heading": fields.text({ label: "Heading" }),
    "headingHighlight": fields.text({ label: "Heading Highlight" }),
    "description": fields.textarea({ label: "Description" }),
    "entries": fields.repeater({ label: "Changelog Entries", itemSchema: {
      "version": fields.text({ label: "Version", required: true }),
      "date": fields.text({ label: "Date", required: true }),
      "title": fields.text({ label: "Title", required: true }),
      "type": fields.select({ label: "Type", options: ["feature","improvement","bugfix"] }),
      "changes": fields.repeater({ label: "Changes", itemSchema: {
        "text": fields.text({ label: "Change Description", required: true })
      } })
    } }),
    "showSubscribe": fields.boolean({ label: "Show Subscribe CTA" }),
    "subscribeText": fields.text({ label: "Subscribe Text" }),
    "subscribeButtonText": fields.text({ label: "Subscribe Button Text" }),
    "subscribeButtonUrl": fields.link({ label: "Subscribe Button URL" })
};

export const changelogBlock = defineBlock({
  type: "changelog",
  category: "Marketing",
  label: "Changelog",
  description: "Chronological list of product updates and releases; for a changelog or updates page.",
  component: Changelog,
  props: changelogProps,
});
