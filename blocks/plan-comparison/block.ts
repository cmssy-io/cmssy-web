import { defineBlock, fields } from "@cmssy/react";
import PlanComparison from "./PlanComparison";
import type { Plan } from "@/lib/plans";
import type { DeliveryLimits } from "@/lib/limits";

export const planComparisonProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 6.1" }),
  eyebrow: fields.text({ label: "Eyebrow", defaultValue: "EVERY LIMIT" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "What each plan contains",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "Every number here is read from the same table the product enforces.",
  }),
  unlimitedLabel: fields.text({
    label: "Word for an uncapped limit",
    defaultValue: "Unlimited",
    required: true,
  }),
  includedLabel: fields.text({
    label: "Word for an included capability",
    defaultValue: "Included",
    required: true,
  }),
  excludedLabel: fields.text({
    label: "Word for a capability the plan lacks",
    defaultValue: "—",
    required: true,
  }),
  columns: fields.repeater({
    label: "Plan Columns",
    itemSchema: {
      planId: fields.select({
        label: "Plan",
        defaultValue: "free",
        options: ["free", "pro", "enterprise"],
      }),
      name: fields.text({ label: "Plan Name", required: true }),
    },
  }),
  rows: fields.repeater({
    label: "Rows",
    itemSchema: {
      label: fields.text({ label: "Row Label", required: true }),
      metric: fields.select({
        label: "Metric",
        defaultValue: "workspaces",
        options: [
          "workspaces",
          "members",
          "pages",
          "storage",
          "upload",
          "aiCredits",
          "apiRequests",
          "bandwidth",
          "removeBranding",
          "cart",
          "sso",
        ],
      }),
    },
  }),
  footnote: fields.text({
    label: "Footnote",
    placeholder: "Optional line under the table",
  }),
  rateLimitLabel: fields.text({
    label: "Delivery rate limit label",
    placeholder: "e.g., Delivery rate limit (all plans)",
  }),
  rateLimitUnit: fields.text({
    label: "Delivery rate limit unit",
    placeholder: "e.g., requests / minute per workspace",
  }),
  rateLimitNote: fields.text({
    label: "Delivery rate limit note",
    placeholder: "e.g., Every read counts, cached or not",
  }),
};

export const planComparisonBlock = defineBlock({
  type: "plan-comparison",
  category: "Marketing",
  label: "Plan Comparison",
  description:
    "Full plan-by-plan limit table; the numbers are served from the API that enforces them, so the page cannot disagree with the product.",
  component: PlanComparison,
  props: planComparisonProps,
  loader: async (): Promise<{
    plans: Plan[] | null;
    delivery: DeliveryLimits | null;
  }> => {
    const { fetchPlans } = await import("@/lib/plans-server");
    const { fetchDeliveryLimits } = await import("@/lib/limits-server");
    const [plans, delivery] = await Promise.all([
      fetchPlans(),
      fetchDeliveryLimits(),
    ]);
    return { plans, delivery };
  },
});
