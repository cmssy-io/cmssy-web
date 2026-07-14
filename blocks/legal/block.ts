import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

export const legalProps = {
  badge: fields.text({ label: "Badge Text", defaultValue: "Privacy" }),
  heading: fields.text({ label: "Heading", defaultValue: "Privacy" }),
  headingHighlight: fields.text({
    label: "Heading Highlight",
    defaultValue: "Policy",
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "Learn how we collect, use, and protect your personal information.",
  }),
  showSummary: fields.boolean({
    label: "Show Summary Box",
    defaultValue: true,
  }),
  summaryTitle: fields.text({
    label: "Summary Title",
    defaultValue: "TL;DR",
  }),
  summaryContent: fields.textarea({
    label: "Summary Content",
    defaultValue:
      "We respect your privacy and only collect data necessary to provide our services. We never sell your data.",
  }),
  sections: fields.repeater({
    label: "Accordion Sections",
    itemSchema: {
      title: fields.text({ label: "Section Title", required: true }),
      content: fields.richText({ label: "Section Content", required: true }),
    },
  }),
  showFooterLinks: fields.boolean({
    label: "Show Footer Links",
    defaultValue: true,
  }),
  footerText: fields.text({
    label: "Footer Text",
    defaultValue: "This policy is part of our",
  }),
  footerLinks: fields.repeater({
    label: "Footer Links",
    itemSchema: {
      text: fields.text({ label: "Link Text", required: true }),
      url: fields.link({ label: "URL", required: true }),
    },
  }),
  lastUpdated: fields.text({
    label: "Last Updated Date",
    defaultValue: "January 2025",
  }),
};

export const legalBlock = defineBlock({
  type: "legal",
  category: "Content",
  label: "Legal",
  description:
    "Long-form legal text such as terms or privacy; for a legal or policy page.",
  component: Component,
  // Sanitize CMS-authored legal HTML server-side (stored-XSS guard). Runs during
  // SSR; the sanitized per-section HTML is passed to the (client) component as
  // `data.sections`. sanitize-html is dynamically imported so it never enters
  // the client bundle. The component falls back to escaped text when `data` is
  // absent (e.g. the editor, where the loader doesn't run).
  loader: async ({ content }): Promise<{ sections: string[] }> => {
    const rawSections = Array.isArray(content.sections)
      ? (content.sections as Array<{ content?: unknown }>)
      : [];
    if (rawSections.length === 0) return { sections: [] };

    const { default: sanitizeHtml } = await import("sanitize-html");
    const options = {
      allowedTags: [
        "p",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "a",
        "h2",
        "h3",
        "h4",
        "br",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "code",
      ],
      allowedAttributes: { a: ["href", "target", "rel"] },
      // Only safe URL schemes for links (no javascript:/data:).
      allowedSchemes: ["http", "https", "mailto", "tel"],
      transformTags: {
        // Enforce rel only on links that open a new tab, and merge with any
        // existing rel tokens (e.g. nofollow) rather than overwriting them.
        a: (tagName: string, attribs: Record<string, string>) => {
          if (attribs.target === "_blank") {
            const tokens = new Set(
              (attribs.rel || "").split(/\s+/).filter(Boolean),
            );
            tokens.add("noopener");
            tokens.add("noreferrer");
            attribs.rel = Array.from(tokens).join(" ");
          }
          return { tagName, attribs };
        },
      },
    };

    const sections = rawSections.map((s) =>
      sanitizeHtml(typeof s?.content === "string" ? s.content : "", options),
    );
    return { sections };
  },
  props: legalProps,
});
