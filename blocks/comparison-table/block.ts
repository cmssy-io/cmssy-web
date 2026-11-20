import { defineBlock, fields } from "@cmssy/react";
import ComparisonTable from "./ComparisonTable";

export const comparisonTableProps = {
  fig: fields.text({ label: "Fig Number" }),
  eyebrow: fields.text({ label: "Eyebrow" }),
  heading: fields.text({
    label: "Heading",
    defaultValue: "An honest look",
    required: true,
  }),
  description: fields.textarea({
    label: "Description",
  }),
  competitors: fields.repeater({
    label: "Competitor Columns",
    itemSchema: {
      name: fields.text({ label: "Name", required: true }),
      // Our own page comparing against this competitor. Links in the table
      // head give those pages a path from the homepage, which is how search
      // engines find and weigh them.
      href: fields.link({ label: "Comparison page" }),
    },
  }),
  rows: fields.repeater({
    label: "Rows",
    itemSchema: {
      label: fields.text({ label: "Row Label", required: true }),
      cmssy: fields.text({ label: "cmssy Value", required: true }),
      values: fields.text({
        label: "Competitor Values (| separated)",
        placeholder: "— | — | Add-on | —",
        required: true,
      }),
    },
  }),
  linkLabel: fields.text({ label: "Link Label" }),
  linkUrl: fields.link({ label: "Link URL" }),
  footnote: fields.text({
    label: "Footnote",
  }),
};

export const comparisonTableBlock = defineBlock({
  type: "comparison-table",
  category: "Marketing",
  label: "Comparison Table",
  description:
    "Competitor comparison table with a highlighted cmssy column; horizontally scrollable on small screens.",
  component: ComparisonTable,
  props: comparisonTableProps,
});
