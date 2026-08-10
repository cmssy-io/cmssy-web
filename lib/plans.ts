export type PlanId = "free" | "pro" | "enterprise";

export interface PlanPrice {
  amount: number;
  currency: string;
}

export interface PlanLimits {
  maxWorkspaces: number | null;
  maxMembers: number | null;
  maxPages: number | null;
  maxStorageMb: number | null;
  maxUploadMb: number;
  maxAiTokensMonth: number | null;
  maxApiRequestsMonth: number | null;
  maxBandwidthGbMonth: number | null;
  canRemoveBranding: boolean;
  canUseCart: boolean;
  canUseSso: boolean;
}

export interface Plan {
  id: PlanId;
  limits: PlanLimits;
  price: { monthly: PlanPrice; annual: PlanPrice } | null;
  startingPriceUsdMonth: number | null;
}

export function findPlan(plans: Plan[] | null, id: string): Plan | null {
  return plans?.find((plan) => plan.id === id) ?? null;
}

export function formatUsd(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}
