import { defineBlock, fields } from "@cmssy/react";
import Pricing from "./Pricing";

export const pricingProps = {
  fig: fields.text({ label: "Fig Number", defaultValue: "FIG 6.0" }),
  eyebrow: fields.text({ label: "Eyebrow", defaultValue: "PRICING" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Simple pricing, start free",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
    defaultValue:
      "One free project, forever. Upgrade for AI tools, MCP access and more workspaces.",
  }),
  trialNotice: fields.text({
    label: "Trial Notice",
    defaultValue: "Every paid plan starts with a 14-day free trial. No card needed.",
  }),
  popularBadgeText: fields.text({
    label: "Popular Badge Text",
    defaultValue: "MOST POPULAR",
  }),
  annualDiscountLabel: fields.text({
    label: "Annual Toggle Label",
    defaultValue: "Annual −20%",
  }),
  plans: fields.repeater({
    label: "Plans",
    itemSchema: {
      name: fields.text({
        label: "Plan Name",
        defaultValue: "Basic",
        required: true,
      }),
      description: fields.textarea({
        label: "Plan Description",
        defaultValue: "Description of the plan.",
      }),
      price: fields.text({
        label: "Price (annual billing)",
        defaultValue: "$0",
        required: true,
      }),
      priceMonthly: fields.text({
        label: "Price (monthly billing)",
        placeholder: "Leave empty when same as annual",
      }),
      period: fields.text({
        label: "Billing Period",
        defaultValue: "billed annually",
      }),
      periodMonthly: fields.text({
        label: "Billing Period (monthly)",
        placeholder: "/month",
      }),
      popular: fields.boolean({ label: "Is Popular?", defaultValue: false }),
      features: fields.repeater({
        label: "Features",
        itemSchema: {
          feature: fields.text({
            label: "Feature",
            defaultValue: "Feature",
            required: true,
          }),
        },
      }),
      cta: fields.text({
        label: "Call to Action",
        defaultValue: "Get Started",
        required: true,
      }),
      href: fields.link({ label: "Link", defaultValue: "#", required: true }),
    },
  }),
};

export const pricingBlock = defineBlock({
  type: "pricing",
  category: "Marketing",
  label: "Pricing",
  description:
    "Pricing plans with a monthly/annual toggle and a highlighted popular tier; spec-sheet styling with a FIG eyebrow.",
  component: Pricing,
  props: pricingProps,
});
