import { defineBlock, fields } from "@cmssy/react";
import Pricing from "./Pricing";

export const pricingProps = {
  fig: fields.text({ label: "Fig Number" }),
  eyebrow: fields.text({ label: "Eyebrow" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "Simple pricing, start free",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
  }),
  trialNotice: fields.text({
    label: "Trial Notice",
  }),
  popularBadgeText: fields.text({
    label: "Popular Badge Text",
  }),
  annualDiscountLabel: fields.text({
    label: "Annual Toggle Label",
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
      }),
      price: fields.text({
        label: "Price",
        defaultValue: "$0",
        required: true,
      }),
      priceMonthly: fields.text({
        label: "Price (monthly)",
        placeholder: "$15",
      }),
      period: fields.text({
        label: "Billing Period",
      }),
      periodMonthly: fields.text({
        label: "Billing Period (monthly)",
        placeholder: "/month",
      }),
      popular: fields.boolean({ label: "Is Popular?" }),
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
