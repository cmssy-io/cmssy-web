import type { CmssyPageSummary } from "@cmssy/core";

// Auto-navigation for /docs, derived from the page tree.
//
// `fetchPages` only returns { id, slug, updatedAt, publishedAt } — no title,
// parent, or order. So membership + structure are derived automatically from
// the nested slugs, while section order, page order, and label overrides come
// from a small config (see docs-nav.config.ts). New pages appear in nav with
// zero wiring; only their order/label is optionally curated.

export type DocsNavPage = {
  slug: string;
  label: string;
  /** True for the section's own index page (e.g. /docs/blocks). */
  isIndex: boolean;
};

export type DocsNavSection = {
  /** Section root slug, e.g. /docs/blocks (may not exist as a page). */
  key: string;
  slug: string;
  label: string;
  pages: DocsNavPage[];
};

export type DocsNavConfig = {
  /** Root under which docs live. */
  root: string;
  /** Explicit section order (by key). Unknown sections sort after, A→Z. */
  sectionOrder: string[];
  /** Per-slug label overrides (acronyms, multi-word section names). */
  labels: Record<string, string>;
  /** Optional explicit page order per section key (by full slug). */
  pageOrder: Record<string, string[]>;
};

function humanizeSlug(slug: string): string {
  const last = slug.replace(/\/+$/, "").split("/").pop() || slug;
  return last
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function labelFor(slug: string, config: DocsNavConfig): string {
  return config.labels[slug] ?? humanizeSlug(slug);
}

/** Segments of a slug below the docs root: /docs/blocks/fields → ["blocks","fields"]. */
function segmentsUnderRoot(slug: string, root: string): string[] {
  const normRoot = root.replace(/\/+$/, "");
  if (slug === normRoot) return [];
  if (!slug.startsWith(normRoot + "/")) return [];
  return slug
    .slice(normRoot.length + 1)
    .split("/")
    .filter(Boolean);
}

function orderIndex(order: string[], key: string): number {
  const i = order.indexOf(key);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

/**
 * Build the docs sidebar tree from the flat page list.
 * - Only published pages under the root are included.
 * - Section = first segment under root; its index = the /docs/<section> page.
 * - Pages nested deeper than one level are flattened onto their section.
 */
export function buildDocsNav(
  pages: CmssyPageSummary[],
  config: DocsNavConfig,
): DocsNavSection[] {
  const normRoot = config.root.replace(/\/+$/, "");
  const sections = new Map<string, DocsNavSection>();

  const ensureSection = (key: string): DocsNavSection => {
    let section = sections.get(key);
    if (!section) {
      const slug = `${normRoot}/${key}`;
      section = { key, slug, label: labelFor(slug, config), pages: [] };
      sections.set(key, section);
    }
    return section;
  };

  for (const page of pages) {
    if (!page.publishedAt) continue;
    const segments = segmentsUnderRoot(page.slug, normRoot);
    if (segments.length === 0) continue; // the /docs hub itself is not a nav item
    const [key] = segments;
    const section = ensureSection(key);
    section.pages.push({
      slug: page.slug,
      label: labelFor(page.slug, config),
      isIndex: segments.length === 1,
    });
  }

  const sorted = [...sections.values()].sort(
    (a, b) =>
      orderIndex(config.sectionOrder, a.key) -
        orderIndex(config.sectionOrder, b.key) || a.key.localeCompare(b.key),
  );

  for (const section of sorted) {
    const explicit = config.pageOrder[section.key] ?? [];
    section.pages.sort((a, b) => {
      // Index page always first.
      if (a.isIndex !== b.isIndex) return a.isIndex ? -1 : 1;
      const ai = explicit.indexOf(a.slug);
      const bi = explicit.indexOf(b.slug);
      if (ai !== -1 || bi !== -1) {
        return (
          (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) -
          (bi === -1 ? Number.MAX_SAFE_INTEGER : bi)
        );
      }
      return a.slug.localeCompare(b.slug);
    });
  }

  return sorted;
}

/** Flatten the nav to an ordered list of page slugs (for prev/next). */
export function flattenDocsNav(sections: DocsNavSection[]): DocsNavPage[] {
  return sections.flatMap((s) => s.pages);
}

/** Breadcrumb trail for a slug, from docs root down to the page. */
export function docsBreadcrumbs(
  slug: string,
  config: DocsNavConfig,
): { slug: string; label: string }[] {
  const normRoot = config.root.replace(/\/+$/, "");
  const segments = segmentsUnderRoot(slug, normRoot);
  const trail = [{ slug: normRoot, label: labelFor(normRoot, config) }];
  let acc = normRoot;
  for (const seg of segments) {
    acc = `${acc}/${seg}`;
    trail.push({ slug: acc, label: labelFor(acc, config) });
  }
  return trail;
}

/** Previous/next pages around the current slug in reading order. */
export function docsPrevNext(
  slug: string,
  sections: DocsNavSection[],
): { prev: DocsNavPage | null; next: DocsNavPage | null } {
  const flat = flattenDocsNav(sections);
  const i = flat.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i < flat.length - 1 ? flat[i + 1] : null,
  };
}
