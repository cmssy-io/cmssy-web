export type DocsSearchItem = {
  slug: string;
  label: string;
  section: string;
  description?: string;
};

export type DocsSearchBody = {
  slug: string;
  body: string;
};

export type DocsSearchHit = DocsSearchItem & {
  snippet?: string;
};

const SNIPPET_RADIUS = 70;
const MAX_RESULTS = 12;
const LENGTH_FLOOR = 1_000;

export function searchTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function metaText(item: DocsSearchItem): string {
  return `${item.label} ${item.section} ${item.slug} ${item.description ?? ""}`.toLowerCase();
}

function everyTermIn(text: string, terms: string[]): boolean {
  return terms.every((term) => text.includes(term));
}

export function bodyDensity(body: string, terms: string[]): number {
  const haystack = body.toLowerCase();
  let hits = 0;
  for (const term of terms) {
    let at = haystack.indexOf(term);
    while (at !== -1) {
      hits += 1;
      at = haystack.indexOf(term, at + term.length);
    }
  }
  return hits / Math.max(body.length, LENGTH_FLOOR);
}

export function snippetFor(body: string, terms: string[]): string | undefined {
  const haystack = body.toLowerCase();
  let at = -1;
  for (const term of terms) {
    const found = haystack.indexOf(term);
    if (found !== -1 && (at === -1 || found < at)) at = found;
  }
  if (at === -1) return undefined;

  const rawStart = Math.max(0, at - SNIPPET_RADIUS);
  const rawEnd = Math.min(body.length, at + SNIPPET_RADIUS);
  const start =
    rawStart === 0 ? 0 : body.indexOf(" ", rawStart) + 1 || rawStart;
  const lastSpace = body.lastIndexOf(" ", rawEnd);
  const end = rawEnd === body.length || lastSpace <= start ? rawEnd : lastSpace;

  return `${start > 0 ? "…" : ""}${body.slice(start, end).trim()}${end < body.length ? "…" : ""}`;
}

export function rankMatches(
  items: DocsSearchItem[],
  bodies: Map<string, string>,
  query: string,
  limit = MAX_RESULTS,
): DocsSearchHit[] {
  const terms = searchTerms(query);
  if (terms.length === 0) return [];

  const scored: {
    hit: DocsSearchHit;
    tier: number;
    label: number;
    density: number;
  }[] = [];

  for (const item of items) {
    const label = item.label.toLowerCase();
    const body = bodies.get(item.slug) ?? "";

    let tier: number;
    if (everyTermIn(label, terms)) tier = 0;
    else if (everyTermIn(metaText(item), terms)) tier = 1;
    else if (body && everyTermIn(body.toLowerCase(), terms)) tier = 2;
    else continue;

    scored.push({
      hit: tier === 2 ? { ...item, snippet: snippetFor(body, terms) } : item,
      tier,
      label: item.label.length,
      density: tier === 2 ? bodyDensity(body, terms) : 0,
    });
  }

  return scored
    .sort(
      (a, b) =>
        a.tier - b.tier ||
        (a.tier === 2 ? b.density - a.density : a.label - b.label) ||
        a.hit.slug.localeCompare(b.hit.slug),
    )
    .slice(0, limit)
    .map((entry) => entry.hit);
}
