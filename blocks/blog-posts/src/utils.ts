import { mediaUrl, type MediaLike } from "@cmssy/react";
import type { PageItem, ResolvedMedia } from "@cmssy/types";

function slugOf(value: unknown): string | undefined {
  if (typeof value === "string") return value || undefined;
  if (value && typeof value === "object" && "slug" in value) {
    const { slug } = value as { slug?: unknown };
    return typeof slug === "string" && slug ? slug : undefined;
  }
  return undefined;
}

export function pageSelectorSlug(value: unknown): string | undefined {
  return Array.isArray(value) ? slugOf(value[0]) : slugOf(value);
}

export function getLocalizedField(
  field: Record<string, string> | null | undefined,
  language: string | undefined,
): string {
  if (!field) return "";
  // The active language, then whatever translation exists. No language is
  // hardcoded: which one is the default is the workspace's answer, not ours.
  return (
    (language ? field[language] : undefined) ?? Object.values(field)[0] ?? ""
  );
}

function customField(item: PageItem, key: string): unknown {
  const field = item.customFields?.find((f) => f.fieldKey === key);
  return field?.value ?? null;
}

/**
 * A custom field arrives as JSON - the CMS makes no promise about its shape,
 * and the shape does change: covers moved from a url string to a media
 * reference and every `as string` in this block kept compiling while the
 * images disappeared. So narrow at runtime here, once, and let callers take a
 * type they can trust.
 */
function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value !== "" ? value : null;
}

/** An empty string reads as absent, so `?? fallback` reaches the fallback. */
export function customText(item: PageItem, key: string): string | null {
  return nonEmptyString(customField(item, key));
}

function asMediaLike(value: unknown): MediaLike {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return null;
  const { url } = value as Partial<Pick<ResolvedMedia, "url">>;
  return typeof url === "string" ? url : null;
}

export function customMedia(item: PageItem, key: string): string | null {
  return nonEmptyString(mediaUrl(asMediaLike(customField(item, key))));
}
