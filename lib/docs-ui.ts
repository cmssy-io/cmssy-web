// The docs shell needs a handful of words of its own - "Previous", the search
// placeholder, the empty state. They are not page content, but they are still
// copy in five languages, so they live where the rest of the section lives:
// custom fields on the section's root page. Nothing here is written in the
// repo, and a language the CMS has not been given simply renders no label.

import { pickLocalizedValue } from "./docs-nav";

/** Field key on the section root page → the name the components use. */
const FIELD_KEYS = {
  uiPrevious: "previous",
  uiNext: "next",
  uiSearchPlaceholder: "searchPlaceholder",
  uiSearchEmpty: "searchEmpty",
  uiSearchClose: "searchClose",
  uiNavOpen: "navOpen",
  uiNavClose: "navClose",
  uiNavLabel: "navLabel",
  uiCopyPage: "copyPage",
  uiCopied: "copied",
  uiViewMarkdown: "viewMarkdown",
  uiOpenIn: "openIn",
  uiOpenInPrompt: "openInPrompt",
  uiOverview: "overview",
  uiPageCount: "pageCount",
} as const;

export type DocsUi = Partial<
  Record<(typeof FIELD_KEYS)[keyof typeof FIELD_KEYS], string>
>;

export type PageCustomField = { fieldKey: string; value: unknown };

/** Read one custom field off a page, when it holds a plain string. */
export function customFieldText(
  fields: PageCustomField[] | null | undefined,
  fieldKey: string,
): string {
  const value = (fields ?? []).find((f) => f.fieldKey === fieldKey)?.value;
  return typeof value === "string" ? value : "";
}

function isLocalized(
  value: unknown,
): value is Record<string, string> | string | null | undefined {
  return (
    value == null || typeof value === "string" || typeof value === "object"
  );
}

export function docsUiFrom(
  fields: PageCustomField[] | null | undefined,
  locale: string,
  defaultLocale: string,
): DocsUi {
  const ui: DocsUi = {};
  for (const field of fields ?? []) {
    const key = FIELD_KEYS[field.fieldKey as keyof typeof FIELD_KEYS];
    if (!key || !isLocalized(field.value)) continue;
    const text = pickLocalizedValue(
      field.value as Record<string, string> | string | null,
      locale,
      defaultLocale,
    );
    if (text) ui[key] = text;
  }
  return ui;
}

export function fillCount(template: string | undefined, n: number): string {
  return template ? template.replace(/\{n\}/g, String(n)) : "";
}

export function fillUrl(template: string | undefined, url: string): string {
  if (!template) return url;
  return template.includes("{url}")
    ? template.replace(/\{url\}/g, url)
    : `${template} ${url}`;
}

export function footerForUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      return `${parsed.host}${parsed.pathname === "/" ? "" : parsed.pathname}`;
    } catch {
      return trimmed;
    }
  }
  return trimmed.replace(/^\/+/, "").split(/[?#]/)[0];
}
