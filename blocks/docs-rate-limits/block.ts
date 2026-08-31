import { defineBlock, fields } from "@cmssy/react";
import DocsRateLimits from "./DocsRateLimits";
import type { DeliveryLimits } from "@/lib/limits";

export const docsRateLimitsProps = {
  title: fields.text({ label: "Title", defaultValue: "Delivery rate limits" }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "The public delivery API is budgeted per workspace, with a wider per-IP net against abuse. The numbers below are read from the limiter that enforces them.",
  }),
  perWorkspaceLabel: fields.text({
    label: "Per-workspace row label",
    defaultValue: "Per workspace",
    required: true,
  }),
  perIpLabel: fields.text({
    label: "Per-IP row label",
    defaultValue: "Per IP address",
    required: true,
  }),
  unitLabel: fields.text({
    label: "Unit",
    defaultValue: "requests / minute",
    required: true,
  }),
  scopeHeader: fields.text({
    label: "Scope column header",
    defaultValue: "Scope",
    required: true,
  }),
  limitHeader: fields.text({
    label: "Limit column header",
    defaultValue: "Limit",
    required: true,
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
    "Delivery rate-limit table served from the API that enforces the limits, so the docs cannot disagree with the product.",
  component: DocsRateLimits,
  props: docsRateLimitsProps,
  loader: async (): Promise<{ delivery: DeliveryLimits | null }> => {
    const { fetchDeliveryLimits } = await import("@/lib/limits-server");
    return { delivery: await fetchDeliveryLimits() };
  },
});
