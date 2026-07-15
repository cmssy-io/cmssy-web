import type { BlockProps } from "@cmssy/react";
import type { docsSidebarProps } from "./block";

type SidebarSections = BlockProps<typeof docsSidebarProps>["content"]["sections"];

export type PageEntry =
  | string
  | { slug: string; displayName?: Record<string, string> };

/** Extract slug from a page entry (string or object). */
export function getPageSlug(entry: PageEntry): string {
  return typeof entry === "string" ? entry : entry.slug;
}

function formatSlugAsLabel(slug: string): string {
  const clean = slug.replace(/^\//, "");
  if (!clean) return "Home";
  const last = clean.split("/").pop() || clean;
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Get display label for a page entry, respecting current language. */
export function getPageLabel(entry: PageEntry, language?: string): string {
  if (typeof entry === "object" && entry.displayName) {
    const label =
      (language && entry.displayName[language]) ||
      entry.displayName.en ||
      Object.values(entry.displayName)[0];
    if (label) return label;
  }
  return formatSlugAsLabel(getPageSlug(entry));
}

export function getCurrentPageLabel(
  sections: SidebarSections,
  currentPath: string,
  language?: string,
): string {
  for (const section of sections || []) {
    for (const entry of section.pages || []) {
      if (getPageSlug(entry) === currentPath)
        return getPageLabel(entry, language);
    }
  }
  return "Documentation";
}
