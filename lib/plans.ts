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
  maxUploadMb: number | null;
  maxApiRequestsMonth: number | null;
  maxBandwidthGbMonth: number | null;
  maxOrdersMonth: number | null;
  canUseSso: boolean;
}

export interface Plan {
  id: PlanId;
  limits: PlanLimits;
  price: { monthly: PlanPrice; annual: PlanPrice } | null;
}

export function findPlan(plans: Plan[] | null, id: string): Plan | null {
  return plans?.find((plan) => plan.id === id) ?? null;
}
