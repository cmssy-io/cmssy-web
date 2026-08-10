import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { findPlan, type Plan, type PlanLimits } from "@/lib/plans";
import type { planComparisonProps } from "./block";

interface Labels {
  unlimited: string;
  included: string;
  excluded: string;
}

function trim(value: number): string {
  return String(Number(value.toFixed(1)));
}

function formatCount(value: number): string {
  if (value >= 1_000_000) return `${trim(value / 1_000_000)}M`;
  if (value >= 1_000) return `${trim(value / 1_000)}K`;
  return String(value);
}

function formatStorage(mb: number): string {
  return mb >= 1024 ? `${Math.round(mb / 1024)} GB` : `${mb} MB`;
}

function cell(
  limits: PlanLimits,
  metric: string,
  labels: Labels,
): string | null {
  const capped = (value: number | null, format: (n: number) => string) =>
    value === null ? labels.unlimited : format(value);
  const flag = (value: boolean) => (value ? labels.included : labels.excluded);

  switch (metric) {
    case "workspaces":
      return capped(limits.maxWorkspaces, String);
    case "members":
      return capped(limits.maxMembers, String);
    case "pages":
      return capped(limits.maxPages, String);
    case "storage":
      return capped(limits.maxStorageMb, formatStorage);
    case "upload":
      return formatStorage(limits.maxUploadMb);
    case "aiCredits":
      return capped(limits.maxAiTokensMonth, formatCount);
    case "apiRequests":
      return capped(limits.maxApiRequestsMonth, formatCount);
    case "bandwidth":
      return capped(limits.maxBandwidthGbMonth, (gb) => `${gb} GB`);
    case "removeBranding":
      return flag(limits.canRemoveBranding);
    case "cart":
      return flag(limits.canUseCart);
    case "sso":
      return flag(limits.canUseSso);
    default:
      return null;
  }
}

export default function PlanComparison({
  content,
  data,
}: BlockProps<typeof planComparisonProps, { plans?: Plan[] | null }>) {
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
  } = content;

  const served = data?.plans ?? null;
  const shown = columns
    .map((column) => ({ ...column, plan: findPlan(served, column.planId ?? "") }))
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

        {footnote && (
          <p className="mx-auto mt-6 max-w-5xl text-center font-mono text-[11px] text-muted-foreground">
            {footnote}
          </p>
        )}
      </Container>
    </section>
  );
}
