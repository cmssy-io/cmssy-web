// Docs navigation, derived entirely from the CMS.
//
// Order comes from the page tree (`sortBy: order_asc` - what an editor sees
// when dragging pages around), labels come from each page's `displayName` in
// the active language. Nothing about the docs structure lives in this repo:
// add, rename, reorder or translate a page in cmssy and the sidebar follows.

export type DocsNavPage = {
  slug: string;
  label: string;
  /** True for the section's own index page (e.g. /docs/blocks). */
  isIndex: boolean;
};

export type DocsNavSection = {
  /** Section root slug, e.g. /docs/blocks. */
  slug: string;
  label: string;
  pages: DocsNavPage[];
};

/** One published page, as the delivery API returns it under a parent slug. */
export type DocsPageNode = {
  fullSlug: string;
  displayName?: Record<string, string> | string | null;
  seoDescription?: Record<string, string> | string | null;
};

/** Same fallback chain as the labels, for any localized field. */
export function pickLocalizedValue(
  value: Record<string, string> | string | null | undefined,
  locale: string,
  defaultLocale: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value[defaultLocale] ?? Object.values(value)[0] ?? "";
}

/** Last resort: a page with no display name in any language. */
function humanizeSlug(slug: string): string {
  const last = slug.replace(/\/+$/, "").split("/").pop() || slug;
  return last
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function labelForPage(
  page: DocsPageNode,
  locale: string,
  defaultLocale: string,
): string {
  const name = page.displayName;
  if (typeof name === "string" && name.trim()) return name;
  if (name && typeof name === "object") {
    const picked =
      name[locale] ?? name[defaultLocale] ?? Object.values(name)[0] ?? "";
    if (picked.trim()) return picked;
  }
  return humanizeSlug(page.fullSlug);
}

/**
 * Build the sidebar from the section pages and their children, both already
 * ordered by the CMS. A section leads with its own index page.
 */
export function buildDocsNav(
  sections: { page: DocsPageNode; children: DocsPageNode[] }[],
  locale: string,
  defaultLocale: string,
): DocsNavSection[] {
  const label = (page: DocsPageNode) =>
    labelForPage(page, locale, defaultLocale);

  return sections.map(({ page, children }) => ({
    slug: page.fullSlug,
    label: label(page),
    pages: [
      { slug: page.fullSlug, label: label(page), isIndex: true },
      ...children.map((child) => ({
        slug: child.fullSlug,
        label: label(child),
        isIndex: false,
      })),
    ],
  }));
}

/** Flatten the nav to an ordered list of pages (for prev/next). */
export function flattenDocsNav(sections: DocsNavSection[]): DocsNavPage[] {
  return sections.flatMap((s) => s.pages);
}

/**
 * Breadcrumb trail for a slug, from the section root down to the page. Labels
 * come from the same nav the sidebar renders, so a crumb can never read
 * differently from the entry it points at.
 */
export function docsBreadcrumbs(
  slug: string,
  sections: DocsNavSection[],
  root: { slug: string; label: string },
): { slug: string; label: string }[] {
  const flat = flattenDocsNav(sections);
  const labelOf = (target: string) =>
    flat.find((p) => p.slug === target)?.label ?? humanizeSlug(target);

  const normRoot = root.slug.replace(/\/+$/, "");
  const trail = [{ slug: normRoot, label: root.label }];
  if (!slug.startsWith(normRoot + "/")) return trail;

  let acc = normRoot;
  for (const segment of slug.slice(normRoot.length + 1).split("/")) {
    if (!segment) continue;
    acc = `${acc}/${segment}`;
    trail.push({ slug: acc, label: labelOf(acc) });
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
