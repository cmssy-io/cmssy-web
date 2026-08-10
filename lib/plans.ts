import { resolveApiUrl } from "@/services/gateway";

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

export async function fetchPlans(): Promise<Plan[] | null> {
  const base = resolveApiUrl().replace(/\/graphql\/?$/, "");
  try {
    const response = await fetch(`${base}/public/plans`, {
      next: { revalidate: 600 },
    });
    if (!response.ok) {
      console.error(
        `[plans] ${base}/public/plans responded ${response.status}`,
      );
      return null;
    }
    const json = (await response.json()) as { plans?: Plan[] };
    return json.plans ?? null;
  } catch (error) {
    console.error("[plans] failed to load the plan table", error);
    return null;
  }
}

export function findPlan(plans: Plan[] | null, id: string): Plan | null {
  return plans?.find((plan) => plan.id === id) ?? null;
}

export function formatUsd(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}
