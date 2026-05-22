import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Header Navigation",
  description:
    "Clean, responsive header with logo, navigation, and CTA buttons",
  category: "Layout",
  layoutPosition: "header",
  tags: ["header", "navigation", "menu", "navbar"],

  // @ts-expect-error groups is supported by CLI runtime but not yet in @cmssy/types BlockConfig
  groups: {
    logo: { label: "Logo", icon: "Image" },
    navigation: { label: "Navigation", icon: "Menu" },
    primaryCta: { label: "Primary CTA", icon: "MousePointer" },
    secondaryCta: {
      label: "Secondary CTA",
      icon: "MousePointer",
      collapsed: true,
    },
    behavior: { label: "Behavior", icon: "Settings", collapsed: true },
    announcement: {
      label: "Announcement Bar",
      icon: "Megaphone",
      collapsed: true,
    },
  },

  useClient: true,
  schema: {
    logo: field({
      type: "media",
      label: "Logo",
      placeholder: "Recommended: SVG or PNG with transparent background",
      group: "logo",
    }),
    logoText: field({
      type: "singleLine",
      label: "Logo Text",
      defaultValue: "Brand",
      placeholder: "Shown next to logo or as fallback",
      group: "logo",
    }),
    logoSize: field({
      type: "select",
      label: "Logo Size",
      defaultValue: "md",
      options: [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
      group: "logo",
    }),

    navigation: field({
      type: "repeater",
      label: "Navigation Items",
      group: "navigation",
      schema: {
        label: field({
          type: "singleLine",
          label: "Label",
          required: true,
        }),
        url: field({
          type: "link",
          label: "URL",
        }),
        openInNewTab: field({
          type: "boolean",
          label: "Open in new tab",
          defaultValue: false,
        }),
        columns: field({
          type: "select",
          label: "Dropdown Columns",
          defaultValue: "none",
          options: [
            { value: "none", label: "No dropdown (plain link)" },
            { value: "1", label: "1 column" },
            { value: "2", label: "2 columns" },
            { value: "3", label: "3 columns" },
          ],
        }),
        children: field({
          type: "repeater",
          label: "Dropdown Links",
          showWhen: { field: "columns", notEquals: "none" },
          schema: {
            label: field({
              type: "singleLine",
              label: "Label",
              required: true,
            }),
            description: field({
              type: "singleLine",
              label: "Description",
            }),
            url: field({
              type: "link",
              label: "URL",
              required: true,
            }),
            icon: field({
              type: "singleLine",
              label: "Lucide Icon Name",
              placeholder: "e.g. Zap, BookOpen, Code",
            }),
            openInNewTab: field({
              type: "boolean",
              label: "Open in new tab",
              defaultValue: false,
            }),
          },
        }),
      },
    }),

    showCta: field({
      type: "boolean",
      label: "Show CTA Button",
      defaultValue: true,
      group: "primaryCta",
    }),
    ctaLabel: field({
      type: "singleLine",
      label: "CTA Label",
      defaultValue: "Get Started",
      group: "primaryCta",
      showWhen: { field: "showCta", equals: true },
    }),
    ctaUrl: field({
      type: "link",
      label: "CTA URL",
      defaultValue: "/signup",
      group: "primaryCta",
      showWhen: { field: "showCta", equals: true },
    }),
    ctaStyle: field({
      type: "select",
      label: "CTA Style",
      defaultValue: "primary",
      options: [
        { value: "primary", label: "Primary (Gradient)" },
        { value: "secondary", label: "Secondary (Dark)" },
        { value: "outline", label: "Outline" },
      ],
      group: "primaryCta",
      showWhen: { field: "showCta", equals: true },
    }),

    showSecondaryCta: field({
      type: "boolean",
      label: "Show Secondary CTA",
      defaultValue: false,
      group: "secondaryCta",
    }),
    secondaryCtaLabel: field({
      type: "singleLine",
      label: "Secondary CTA Label",
      defaultValue: "Login",
      group: "secondaryCta",
      showWhen: { field: "showSecondaryCta", equals: true },
    }),
    secondaryCtaUrl: field({
      type: "link",
      label: "Secondary CTA URL",
      defaultValue: "/login",
      group: "secondaryCta",
      showWhen: { field: "showSecondaryCta", equals: true },
    }),
    secondaryCtaStyle: field({
      type: "select",
      label: "Secondary CTA Style",
      defaultValue: "ghost",
      options: [
        { value: "ghost", label: "Ghost" },
        { value: "outline", label: "Outline" },
        { value: "link", label: "Link" },
      ],
      group: "secondaryCta",
      showWhen: { field: "showSecondaryCta", equals: true },
    }),

    sticky: field({
      type: "boolean",
      label: "Sticky Header",
      defaultValue: true,
      group: "behavior",
    }),
    transparent: field({
      type: "boolean",
      label: "Transparent Background",
      defaultValue: false,
      group: "behavior",
    }),
    logoutButtonText: field({
      type: "singleLine",
      label: "Logout Button Text",
      defaultValue: "Log out",
      group: "behavior",
    }),
    showLanguageSwitcher: field({
      type: "boolean",
      label: "Show Language Switcher",
      defaultValue: false,
      group: "behavior",
    }),

    showAnnouncement: field({
      type: "boolean",
      label: "Show Announcement Bar",
      defaultValue: false,
      group: "announcement",
    }),
    announcementText: field({
      type: "singleLine",
      label: "Announcement Text",
      placeholder: "New feature available!",
      group: "announcement",
      showWhen: { field: "showAnnouncement", equals: true },
    }),
    announcementLink: field({
      type: "link",
      label: "Announcement Link",
      group: "announcement",
      showWhen: { field: "showAnnouncement", equals: true },
    }),
    announcementBg: field({
      type: "color",
      label: "Announcement Background",
      defaultValue: "#7c3aed",
      group: "announcement",
      showWhen: { field: "showAnnouncement", equals: true },
    }),
    announcementTextColor: field({
      type: "color",
      label: "Announcement Text Color",
      defaultValue: "#ffffff",
      group: "announcement",
      showWhen: { field: "showAnnouncement", equals: true },
    }),
    announcementDismissible: field({
      type: "boolean",
      label: "Dismissible",
      defaultValue: true,
      group: "announcement",
      showWhen: { field: "showAnnouncement", equals: true },
    }),
  },
});
