import { resolveApiUrl } from "@/services/gateway";
import type { DeliveryLimits } from "./limits";

export async function fetchDeliveryLimits(): Promise<DeliveryLimits | null> {
  const base = resolveApiUrl().replace(/\/graphql\/?$/, "");
  try {
    const response = await fetch(`${base}/public/limits`, {
      next: { revalidate: 600 },
    });
    if (!response.ok) {
      console.error(
        `[limits] ${base}/public/limits responded ${response.status}`,
      );
      return null;
    }
    const json = (await response.json()) as {
      delivery?: DeliveryLimits;
    };
    return json.delivery ?? null;
  } catch (error) {
    console.error("[limits] failed to load the delivery limits", error);
    return null;
  }
}
