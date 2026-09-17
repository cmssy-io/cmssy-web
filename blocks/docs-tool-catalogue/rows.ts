export interface CatalogueEntry {
  name?: string;
  permission?: string;
  description?: string;
}

export interface CatalogueRow {
  name: string;
  permission: string;
  description: string;
}

export function catalogueRows(
  tools: CatalogueEntry[] | undefined,
): CatalogueRow[] {
  return (tools ?? [])
    .filter((tool) => Boolean(tool?.name?.trim()))
    .map((tool) => ({
      name: (tool.name ?? "").trim(),
      permission: tool.permission?.trim() ?? "",
      description: tool.description?.trim() ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
