import type { PageItem } from "@cmssy/types";

export function getLocalizedField(
  field: Record<string, string> | null | undefined,
  language: string,
): string {
  if (!field) return "";
  return field[language] ?? field.en ?? Object.values(field)[0] ?? "";
}

export function getCustomField(item: PageItem, key: string): unknown {
  const field = item.customFields?.find((f) => f.fieldKey === key);
  return field?.value ?? null;
}
