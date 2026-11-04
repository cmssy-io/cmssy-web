export function withStyle<C extends object>(
  content: C,
  style?: Record<string, unknown>,
): C {
  if (!style) return content;
  const merged = { ...content } as Record<string, unknown>;
  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined && value !== null && value !== "") merged[key] = value;
  }
  return merged as C;
}
