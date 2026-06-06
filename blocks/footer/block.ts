import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const footerBlock = defineBlock({
  type: "footer",
  label: "Footer",
  layoutPositions: ["footer"],
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{ content: Record<string, unknown> }>,
  props: {
    "logo": fields.media({ label: "Logo" }),
    "logoText": fields.singleLine({ label: "Logo Text", defaultValue: "cmssy" }),
    "tagline": fields.multiLine({ label: "Tagline", defaultValue: "The modern CMS that makes website creation effortless. Build beautiful websites with AI-powered tools." }),
    "linkColumns": fields.repeater({ label: "Link Columns", itemSchema: {
      "title": fields.singleLine({ label: "Column Title", required: true }),
      "links": fields.repeater({ label: "Links", itemSchema: {
        "name": fields.singleLine({ label: "Link Text", required: true }),
        "href": fields.link({ label: "URL", required: true })
      } })
    } }),
    "showSocial": fields.boolean({ label: "Show Social Links", defaultValue: true }),
    "twitterUrl": fields.link({ label: "Twitter/X URL" }),
    "githubUrl": fields.link({ label: "GitHub URL" }),
    "linkedinUrl": fields.link({ label: "LinkedIn URL" }),
    "copyrightText": fields.singleLine({ label: "Copyright Text", defaultValue: "cmssy. All rights reserved." }),
    "showLanguageSwitcher": fields.boolean({ label: "Show Language Switcher", defaultValue: false })
  },
});
