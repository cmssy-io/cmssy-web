import { defineBlock, field } from "@cmssy/cli/config";

export default defineBlock({
  name: "Legal",
  description:
    "Legal page with accordion sections for privacy policy, terms of service, cookies",
  category: "marketing",
  tags: ["legal", "privacy", "terms", "cookies", "policy", "accordion"],

  useClient: true,
  schema: {
    badge: field({
      type: "singleLine",
      label: "Badge Text",
      defaultValue: "Privacy",
      group: "header",
    }),
    heading: field({
      type: "singleLine",
      label: "Heading",
      defaultValue: "Privacy",
      group: "header",
    }),
    headingHighlight: field({
      type: "singleLine",
      label: "Heading Highlight",
      defaultValue: "Policy",
      group: "header",
    }),
    description: field({
      type: "multiLine",
      label: "Description",
      defaultValue:
        "Learn how we collect, use, and protect your personal information.",
      group: "header",
    }),

    showSummary: field({
      type: "boolean",
      label: "Show Summary Box",
      defaultValue: true,
      group: "summary",
    }),
    summaryTitle: field({
      type: "singleLine",
      label: "Summary Title",
      defaultValue: "TL;DR",
      group: "summary",
      showWhen: { field: "showSummary", equals: true },
    }),
    summaryContent: field({
      type: "multiLine",
      label: "Summary Content",
      defaultValue:
        "We respect your privacy and only collect data necessary to provide our services. We never sell your data.",
      group: "summary",
      showWhen: { field: "showSummary", equals: true },
    }),

    sections: field({
      type: "repeater",
      label: "Accordion Sections",
      group: "sections",
      schema: {
        title: field({
          type: "singleLine",
          label: "Section Title",
          required: true,
        }),
        content: field({
          type: "richText",
          label: "Section Content",
          required: true,
        }),
      },
    }),

    showFooterLinks: field({
      type: "boolean",
      label: "Show Footer Links",
      defaultValue: true,
      group: "footer",
    }),
    footerText: field({
      type: "singleLine",
      label: "Footer Text",
      defaultValue: "This policy is part of our",
      group: "footer",
      showWhen: { field: "showFooterLinks", equals: true },
    }),
    footerLinks: field({
      type: "repeater",
      label: "Footer Links",
      group: "footer",
      showWhen: { field: "showFooterLinks", equals: true },
      schema: {
        text: field({
          type: "singleLine",
          label: "Link Text",
          required: true,
        }),
        url: field({
          type: "link",
          label: "URL",
          required: true,
        }),
      },
    }),
    lastUpdated: field({
      type: "singleLine",
      label: "Last Updated Date",
      defaultValue: "January 2025",
      group: "footer",
    }),
  },
});
