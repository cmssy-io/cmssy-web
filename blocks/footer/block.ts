import { defineBlock, fields } from "@cmssy/react";
import Footer from "./Footer";

export const footerProps = {
  "logo": fields.media({ label: "Logo" }),
  "logoText": fields.text({ label: "Logo Text" }),
  "tagline": fields.textarea({ label: "Tagline" }),
  "linkColumns": fields.repeater({ label: "Link Columns", itemSchema: {
    "title": fields.text({ label: "Column Title", required: true }),
    "links": fields.repeater({ label: "Links", itemSchema: {
      "name": fields.text({ label: "Link Text", required: true }),
      "href": fields.link({ label: "URL", required: true })
    } })
  } }),
  "showSocial": fields.boolean({ label: "Show Social Links" }),
  "twitterUrl": fields.link({ label: "Twitter/X URL" }),
  "githubUrl": fields.link({ label: "GitHub URL" }),
  "linkedinUrl": fields.link({ label: "LinkedIn URL" }),
  "youtubeUrl": fields.link({ label: "YouTube URL" }),
  "metaLine": fields.text({ label: "Meta Line (mono)", placeholder: "This site ships llms.txt + schema.org" }),
  "builtOnText": fields.text({ label: "Built-on Text (mono)", placeholder: "Built on cmssy" }),
  "copyrightText": fields.text({ label: "Copyright Text" }),
  "showLanguageSwitcher": fields.boolean({ label: "Show Language Switcher" })
};

export const footerBlock = defineBlock({
  type: "footer",
  category: "Layout",
  label: "Footer",
  description: "Site footer with links and legal (layout block); bottom of every page.",
  layoutRegions: ["footer"],
  component: Footer,
  props: footerProps,
});
