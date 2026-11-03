export interface CatalogueEntry {
  name?: string;
  permission?: string;
  description?: string;
}

export interface CatalogueRow {
  name: string;
  permission: string;
  /** The first sentence: what a person scans for. */
  summary: string;
  /** The rest, written for the agent calling the tool. */
  details: string;
}

const ABBREVIATION = /\b(?:e\.g|i\.e|etc|vs)\.$/i;

/** Splits at the first real sentence end, not at "e.g." or inside a token. */
export function splitDescription(
  description: string,
): Pick<CatalogueRow, "summary" | "details"> {
  for (const match of description.matchAll(/[.!?]\s+/g)) {
    const end = match.index + 1;
    if (ABBREVIATION.test(description.slice(0, end))) continue;
    return {
      summary: description.slice(0, end),
      details: description.slice(end).trim(),
    };
  }
  return { summary: description, details: "" };
}

export function catalogueRows(
  tools: CatalogueEntry[] | undefined,
): CatalogueRow[] {
  return (tools ?? [])
    .filter((tool) => Boolean(tool?.name?.trim()))
    .map((tool) => ({
      name: (tool.name ?? "").trim(),
      permission: tool.permission?.trim() ?? "",
      ...splitDescription(tool.description?.trim() ?? ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
