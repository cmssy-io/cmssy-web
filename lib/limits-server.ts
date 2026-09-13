import { resolveApiUrl } from "@/services/gateway";
import type { DeliveryLimits, PublishedLimits } from "./limits";

async function fetchPublicLimits(): Promise<PublishedLimits | null> {
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
    const json = (await response.json()) as Partial<PublishedLimits>;
    return {
      delivery: json.delivery ?? null,
      groups: json.groups ?? [],
      protection: json.protection ?? [],
    };
  } catch (error) {
    console.error("[limits] failed to load the published limits", error);
    return null;
  }
}

export async function fetchDeliveryLimits(): Promise<DeliveryLimits | null> {
  return (await fetchPublicLimits())?.delivery ?? null;
}

export async function fetchPublishedLimits(): Promise<PublishedLimits | null> {
  return fetchPublicLimits();
}
