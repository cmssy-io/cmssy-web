import { mediaUrl, type MediaLike } from "@cmssy/react";
import type { PageItem } from "@cmssy/types";

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
export function customText(item: PageItem, key: string): string | null {
  const value = customField(item, key);
  return typeof value === "string" && value !== "" ? value : null;
}

export function customMedia(item: PageItem, key: string): string | null {
  return mediaUrl(customField(item, key) as MediaLike);
}
