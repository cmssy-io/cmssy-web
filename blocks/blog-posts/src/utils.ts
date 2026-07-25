import type { PageItem } from "@cmssy/types";

export function getLocalizedField(
  field: Record<string, string> | null | undefined,
  language: string | undefined,
): string {
  if (!field) return "";
  // The active language, then whatever translation exists. No language is
  // hardcoded: which one is the default is the workspace's answer, not ours.
  return (language ? field[language] : undefined) ?? Object.values(field)[0] ?? "";
}

export function getCustomField(item: PageItem, key: string): unknown {
  const field = item.customFields?.find((f) => f.fieldKey === key);
  return field?.value ?? null;
}
