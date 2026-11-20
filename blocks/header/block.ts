import type { ComponentType } from "react";
import { defineBlock, fields } from "@cmssy/react";
import type { BlockProps } from "@cmssy/react";
import Header from "./Header";
import { headerIconNames } from "./icons";

export const headerProps = {
    logo: fields.media({
      label: "Logo",
      placeholder: "Recommended: SVG or PNG with transparent background",
      localized: false,
    }),
    logoText: fields.text({
      label: "Logo Text",
placeholder: "Shown next to logo or as fallback",
      localized: false,
    }),
    logoSize: fields.select({
      label: "Logo Size",
options: ["sm", "md", "lg"],
      tab: "style",
    }),
    navigation: fields.repeater({
      label: "Navigation Items",
      itemSchema: {
        label: fields.text({ label: "Label", required: true }),
        url: fields.link({ label: "URL", localized: false }),
        openInNewTab: fields.boolean({
          label: "Open in new tab",
localized: false,
        }),
        columns: fields.select({
          label: "Dropdown Columns",
options: ["none", "1", "2", "3"],
          localized: false,
        }),
        children: fields.repeater({
          label: "Dropdown Links",
          itemSchema: {
            label: fields.text({ label: "Label", required: true }),
            description: fields.text({ label: "Description" }),
            url: fields.link({ label: "URL", required: true, localized: false }),
            icon: fields.select({
              label: "Icon",
              options: headerIconNames,
              localized: false,
            }),
            openInNewTab: fields.boolean({
              label: "Open in new tab",
localized: false,
            }),
          },
        }),
      },
    }),
    showCta: fields.boolean({
      label: "Show CTA Button",
localized: false,
    }),
    ctaLabel: fields.text({
      label: "CTA Label",
    }),
    ctaUrl: fields.link({ label: "CTA URL", localized: false }),
    ctaStyle: fields.select({
      label: "CTA Style",
options: ["primary", "secondary", "outline"],
      localized: false,
    }),
    showSecondaryCta: fields.boolean({
      label: "Show Secondary CTA",
localized: false,
    }),
    secondaryCtaLabel: fields.text({
      label: "Secondary CTA Label",
    }),
    secondaryCtaUrl: fields.link({
      label: "Secondary CTA URL",
      localized: false,
    }),
    secondaryCtaStyle: fields.select({
      label: "Secondary CTA Style",
options: ["ghost", "outline", "link"],
      localized: false,
    }),
    sticky: fields.boolean({
      label: "Sticky Header",
localized: false,
    }),
    transparent: fields.boolean({
      label: "Transparent Background",
tab: "style",
    }),
    logoutButtonText: fields.text({
      label: "Logout Button Text",
    }),
    showLanguageSwitcher: fields.boolean({
      label: "Show Language Switcher",
localized: false,
    }),
    showAnnouncement: fields.boolean({
      label: "Show Announcement Bar",
localized: false,
    }),
    announcementText: fields.text({
      label: "Announcement Text",
      placeholder: "New feature available!",
    }),
    announcementLink: fields.link({
      label: "Announcement Link",
      localized: false,
    }),
    announcementBg: fields.color({
      label: "Announcement Background",
tab: "style",
    }),
    announcementTextColor: fields.color({
      label: "Announcement Text Color",
      /* White on the brand blue is 2.67:1 - the bar is the first line on the
         page and it was the least readable thing on it. Ink reads 6.99:1 on
         the same blue, which is what every other elektryk surface already
         uses for its text. */
tab: "style",
    }),
    announcementDismissible: fields.boolean({
      label: "Dismissible",
localized: false,
    }),
};

export const headerBlock = defineBlock({
  type: "header",
  category: "Layout",
  label: "Header Navigation",
  description:
    "Site header and navigation bar (layout block); top of every page.",
  layoutRegions: ["header"],
  // The header is a layout block whose component reads a custom platform
  // context (auth/customer/logout) that differs from the SDK's block context,
  // so the component is cast; its content shape is still derived from the
  // props schema so the SDK 8 content guard is satisfied.
  component: Header as unknown as ComponentType<{
    content: BlockProps<typeof headerProps>["content"];
  }>,
  props: headerProps,
});
