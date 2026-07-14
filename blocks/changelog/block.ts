import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const changelogProps = {
  badge: fields.text({ label: "Badge Text", defaultValue: "Changelog" }),
  heading: fields.text({ label: "Heading", defaultValue: "What's" }),
  headingHighlight: fields.text({
    label: "Heading Highlight",
    defaultValue: "New",
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "Stay up to date with the latest features, improvements, and fixes.",
  }),
  entries: fields.repeater({
    label: "Changelog Entries",
    itemSchema: {
      version: fields.text({ label: "Version", required: true }),
      date: fields.text({ label: "Date", required: true }),
      title: fields.text({ label: "Title", required: true }),
      type: fields.select({
        label: "Type",
        defaultValue: "feature",
        options: ["feature", "improvement", "bugfix"],
      }),
      changes: fields.repeater({
        label: "Changes",
        itemSchema: {
          text: fields.text({ label: "Change Description", required: true }),
        },
      }),
    },
  }),
  showSubscribe: fields.boolean({
    label: "Show Subscribe CTA",
    defaultValue: true,
  }),
  subscribeText: fields.text({
    label: "Subscribe Text",
    defaultValue: "Subscribe to get notified about new releases",
  }),
  subscribeButtonText: fields.text({
    label: "Subscribe Button Text",
    defaultValue: "Subscribe",
  }),
  subscribeButtonUrl: fields.link({
    label: "Subscribe Button URL",
    defaultValue: "/blog",
  }),
};

export const changelogBlock = defineBlock({
  type: "changelog",
  category: "Marketing",
  label: "Changelog",
  description:
    "Chronological list of product updates and releases; for a changelog or updates page.",
  component: Component,
  props: changelogProps,
});
