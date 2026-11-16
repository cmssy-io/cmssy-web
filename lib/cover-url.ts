/**
 * The cover arrives as JSON with no promised shape: older pages store a url
 * string, newer ones a media reference. Narrow at runtime and treat anything
 * else, or an empty url, as no cover.
 */
export function coverUrl(
  fields: ReadonlyArray<{ fieldKey: string; value: unknown }> | null | undefined,
): string | undefined {
  const value = fields?.find((f) => f.fieldKey === "cover_image")?.value;
  const url =
    typeof value === "string"
      ? value
      : value && typeof value === "object" && "url" in value
        ? (value as { url?: unknown }).url
        : undefined;
  return typeof url === "string" && url !== "" ? url : undefined;
}
