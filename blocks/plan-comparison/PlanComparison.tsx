import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { findPlan, type Plan } from "@/lib/plans";
import type { DeliveryLimits } from "@/lib/limits";
import type { planComparisonProps } from "./block";

import { cell, type Labels } from "./cells";

export default function PlanComparison({
  content,
  context,
  data,
}: BlockProps<
  typeof planComparisonProps,
  { plans?: Plan[] | null; delivery?: DeliveryLimits | null }
>) {
  const {
    fig = "",
    eyebrow = "",
    heading = "",
    description = "",
    unlimitedLabel = "",
    includedLabel = "",
    excludedLabel = "",
    columns = [],
    rows = [],
    footnote = "",
    rateLimitLabel = "",
    rateLimitUnit = "",
    rateLimitNote = "",
  } = content;

  const served = data?.plans ?? null;
  const delivery = data?.delivery ?? null;
  const shown = columns
    .map((column) => ({
      ...column,
      plan: findPlan(served, column.planId ?? ""),
    }))
    .filter((column): column is typeof column & { plan: Plan } =>
      Boolean(column.plan),
    );

  if (shown.length === 0) return null;

  const labels: Labels = {
    unlimited: unlimitedLabel,
    included: includedLabel,
    excluded: excludedLabel,
  };

  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-balance text-foreground">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-5xl overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase" />
                {shown.map((column) => (
                  <th
                    key={column.planId}
                    className="font-heading py-3 pr-4 text-base font-semibold text-foreground"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.metric} className="border-b border-border/60">
                  <th
                    scope="row"
                    className="py-3 pr-4 text-sm font-normal text-muted-foreground"
                  >
                    {row.label}
                  </th>
                  {shown.map((column) => (
                    <td
                      key={column.planId}
                      className="py-3 pr-4 text-sm tabular-nums text-foreground"
                    >
                      {cell(column.plan.limits, row.metric ?? "", labels) ??
                        labels.excluded}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {delivery && rateLimitLabel && (
          <p className="mx-auto mt-6 max-w-5xl text-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {rateLimitLabel}:
            </span>{" "}
            <span className="tabular-nums">
              {delivery.perWorkspacePerMinute.toLocaleString(
                context?.locale.current,
              )}
            </span>{" "}
            {rateLimitUnit}
            {rateLimitNote && <> · {rateLimitNote}</>}
          </p>
        )}

        {footnote && (
          <p className="mx-auto mt-6 max-w-5xl text-center font-mono text-[11px] text-muted-foreground">
            {footnote}
          </p>
        )}
      </Container>
    </section>
  );
}
