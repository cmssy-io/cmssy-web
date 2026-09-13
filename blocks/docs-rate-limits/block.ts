import { defineBlock, fields } from "@cmssy/react";
import DocsRateLimits from "./DocsRateLimits";
import type { PublishedLimits } from "@/lib/limits";

export const docsRateLimitsProps = {
  title: fields.text({ label: "Title", defaultValue: "Protection limits" }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "Every number below is read from the limiter that enforces it, family by family.",
  }),
  resourceHeader: fields.text({
    label: "Resource column header",
    defaultValue: "Endpoint",
    required: true,
  }),
  scopeHeader: fields.text({
    label: "Scope column header",
    defaultValue: "Counted per",
    required: true,
  }),
  limitHeader: fields.text({
    label: "Limit column header",
    defaultValue: "Limit",
    required: true,
  }),
  groups: fields.repeater({
    label: "Families",
    itemSchema: {
      key: fields.text({
        label: "Family key from the API",
        required: true,
        localized: false,
      }),
      label: fields.text({ label: "Heading", required: true }),
      description: fields.textarea({ label: "Intro line" }),
    },
  }),
  vocabulary: fields.repeater({
    label: "Words for the API's keys",
    itemSchema: {
      key: fields.text({
        label: "Key from the API",
        required: true,
        localized: false,
      }),
      label: fields.text({ label: "Word", required: true }),
    },
  }),
  adjustableLabel: fields.text({
    label: "Badge on a limit an operator can move",
    defaultValue: "adjustable",
  }),
  caveat: fields.textarea({
    label: "Caveat",
    defaultValue:
      "Every delivery read counts toward the limit, cached or not - a CDN in front of your site does not stretch the budget.",
  }),
};

export const docsRateLimitsBlock = defineBlock({
  type: "docs-rate-limits",
  category: "Docs",
  label: "Docs Rate Limits",
  description:
    "Protection-limit tables served from the API that enforces the limits, so the docs cannot disagree with the product.",
  component: DocsRateLimits,
  props: docsRateLimitsProps,
  loader: async (): Promise<{ published: PublishedLimits | null }> => {
    const { fetchPublishedLimits } = await import("@/lib/limits-server");
    return { published: await fetchPublishedLimits() };
  },
});
