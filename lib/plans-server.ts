import { resolveApiUrl } from "@/services/gateway";
import type { Plan } from "./plans";

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
