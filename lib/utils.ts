import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string as a localized long date (e.g. "July 15, 2026").
 * `lang` undefined falls back to the runtime's default locale.
 */
export function formatDate(
  dateStr: string | null | undefined,
  lang?: string,
): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(lang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
