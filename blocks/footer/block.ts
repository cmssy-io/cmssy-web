import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const footerProps = {
  logo: fields.media({ label: "Logo" }),
  logoText: fields.text({ label: "Logo Text", defaultValue: "cmssy" }),
  tagline: fields.textarea({
    label: "Tagline",
    defaultValue:
      "The modern CMS that makes website creation effortless. Build beautiful websites with AI-powered tools.",
  }),
  linkColumns: fields.repeater({
    label: "Link Columns",
    itemSchema: {
      title: fields.text({ label: "Column Title", required: true }),
      links: fields.repeater({
        label: "Links",
        itemSchema: {
          name: fields.text({ label: "Link Text", required: true }),
          href: fields.link({ label: "URL", required: true }),
        },
      }),
    },
  }),
  showSocial: fields.boolean({
    label: "Show Social Links",
    defaultValue: true,
  }),
  twitterUrl: fields.link({ label: "Twitter/X URL" }),
  githubUrl: fields.link({ label: "GitHub URL" }),
  linkedinUrl: fields.link({ label: "LinkedIn URL" }),
  copyrightText: fields.text({
    label: "Copyright Text",
    defaultValue: "cmssy. All rights reserved.",
  }),
  showLanguageSwitcher: fields.boolean({
    label: "Show Language Switcher",
    defaultValue: false,
  }),
};

export const footerBlock = defineBlock({
  type: "footer",
  category: "Layout",
  label: "Footer",
  description:
    "Site footer with links and legal (layout block); bottom of every page.",
  layoutPositions: ["footer"],
  component: Component,
  props: footerProps,
});
