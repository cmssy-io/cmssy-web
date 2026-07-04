import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const headerBlock = defineBlock({
  type: "header",
  label: "Header Navigation",
  description: "Site header and navigation bar (layout block); top of every page.",
  layoutPositions: ["header"],
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
  }>,
  props: {
    logo: fields.media({
      label: "Logo",
      placeholder: "Recommended: SVG or PNG with transparent background",
    }),
    logoText: fields.text({
      label: "Logo Text",
      defaultValue: "Brand",
      placeholder: "Shown next to logo or as fallback",
    }),
    logoSize: fields.select({
      label: "Logo Size",
      defaultValue: "md",
      options: ["sm", "md", "lg"],
    }),
    navigation: fields.repeater({
      label: "Navigation Items",
      itemSchema: {
        label: fields.text({ label: "Label", required: true }),
        url: fields.link({ label: "URL" }),
        openInNewTab: fields.boolean({
          label: "Open in new tab",
          defaultValue: false,
        }),
        columns: fields.select({
          label: "Dropdown Columns",
          defaultValue: "none",
          options: ["none", "1", "2", "3"],
        }),
        children: fields.repeater({
          label: "Dropdown Links",
          itemSchema: {
            label: fields.text({ label: "Label", required: true }),
            description: fields.text({ label: "Description" }),
            url: fields.link({ label: "URL", required: true }),
            icon: fields.text({
              label: "Lucide Icon Name",
              placeholder: "e.g. Zap, BookOpen, Code",
            }),
            openInNewTab: fields.boolean({
              label: "Open in new tab",
              defaultValue: false,
            }),
          },
        }),
      },
    }),
    showCta: fields.boolean({ label: "Show CTA Button", defaultValue: true }),
    ctaLabel: fields.text({
      label: "CTA Label",
      defaultValue: "Get Started",
    }),
    ctaUrl: fields.link({ label: "CTA URL", defaultValue: "/signup" }),
    ctaStyle: fields.select({
      label: "CTA Style",
      defaultValue: "primary",
      options: ["primary", "secondary", "outline"],
    }),
    showSecondaryCta: fields.boolean({
      label: "Show Secondary CTA",
      defaultValue: false,
    }),
    secondaryCtaLabel: fields.text({
      label: "Secondary CTA Label",
      defaultValue: "Login",
    }),
    secondaryCtaUrl: fields.link({
      label: "Secondary CTA URL",
      defaultValue: "/login",
    }),
    secondaryCtaStyle: fields.select({
      label: "Secondary CTA Style",
      defaultValue: "ghost",
      options: ["ghost", "outline", "link"],
    }),
    sticky: fields.boolean({ label: "Sticky Header", defaultValue: true }),
    transparent: fields.boolean({
      label: "Transparent Background",
      defaultValue: false,
    }),
    logoutButtonText: fields.text({
      label: "Logout Button Text",
      defaultValue: "Log out",
    }),
    showLanguageSwitcher: fields.boolean({
      label: "Show Language Switcher",
      defaultValue: true,
    }),
    showAnnouncement: fields.boolean({
      label: "Show Announcement Bar",
      defaultValue: false,
    }),
    announcementText: fields.text({
      label: "Announcement Text",
      placeholder: "New feature available!",
    }),
    announcementLink: fields.link({ label: "Announcement Link" }),
    announcementBg: fields.color({
      label: "Announcement Background",
      defaultValue: "#7c3aed",
    }),
    announcementTextColor: fields.color({
      label: "Announcement Text Color",
      defaultValue: "#ffffff",
    }),
    announcementDismissible: fields.boolean({
      label: "Dismissible",
      defaultValue: true,
    }),
  },
});
