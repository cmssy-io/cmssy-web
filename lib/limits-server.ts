import { resolveApiUrl } from "@/services/gateway";
import { publishedLimits } from "./limits";
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
    const limits = publishedLimits(await response.json());
    if (limits.protection.length === 0) {
      console.error(
        `[limits] ${base}/public/limits published no protection table`,
      );
    }
    return limits;
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
