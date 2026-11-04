import type { PlanLimits } from "@/lib/plans";

export interface Labels {
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
  return mb >= 1024 ? `${trim(mb / 1024)} GB` : `${mb} MB`;
}

export function cell(
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
      return capped(limits.maxUploadMb, formatStorage);
    case "byokAi":
      return labels.included;
    case "apiRequests":
      return capped(limits.maxApiRequestsMonth, formatCount);
    case "bandwidth":
      return capped(limits.maxBandwidthGbMonth, (gb) => `${gb} GB`);
    case "orders":
      return capped(limits.maxOrdersMonth, formatCount);
    case "sso":
      return flag(limits.canUseSso);
    default:
      return null;
  }
}
