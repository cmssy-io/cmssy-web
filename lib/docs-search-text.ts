import type { BlockPropsSchema, FieldDefinition } from "@cmssy/types";

const PROSE_FIELDS = new Set(["text", "textarea", "richText", "markdown"]);

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

const PER_PAGE_LIMIT = 20_000;

function decode(value: string): string {
  return value.replace(
    /&(#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi,
    (whole, _match, dec, hex, name) => {
      if (dec) return String.fromCodePoint(Number(dec));
      if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
      return ENTITIES[String(name).toLowerCase()] ?? whole;
    },
  );
}

function stripMarkup(value: string): string {
  return decode(value.replace(/<[^>]*>/g, " "));
}

function collect(field: FieldDefinition, value: unknown, out: string[]): void {
  if (field.type === "repeater") {
    const itemSchema = field.itemSchema;
    if (!itemSchema || !Array.isArray(value)) return;
    for (const item of value) {
      if (!item || typeof item !== "object") continue;
      collectSchema(itemSchema, item as Record<string, unknown>, out);
    }
    return;
  }

  if (!PROSE_FIELDS.has(field.type) || typeof value !== "string") return;
  const text =
    field.type === "text" || field.type === "textarea"
      ? value
      : stripMarkup(value);
  const trimmed = text.trim();
  if (trimmed) out.push(trimmed);
}

function collectSchema(
  schema: BlockPropsSchema,
  content: Record<string, unknown>,
  out: string[],
): void {
  for (const [name, field] of Object.entries(schema)) {
    collect(field, content[name], out);
  }
}

export function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function harvestBlockText(
  schema: BlockPropsSchema | undefined,
  content: unknown,
): string {
  if (!schema || !content || typeof content !== "object") return "";
  const out: string[] = [];
  collectSchema(schema, content as Record<string, unknown>, out);
  return normalize(out.join(" "));
}

export function joinPageText(parts: string[]): string {
  const body = normalize(parts.filter(Boolean).join(" "));
  return body.length > PER_PAGE_LIMIT ? body.slice(0, PER_PAGE_LIMIT) : body;
}
