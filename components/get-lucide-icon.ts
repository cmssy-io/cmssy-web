import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Resolve a lucide-react icon component by its name (as stored in block
 * content). Returns `fallback` when the name is empty or unknown.
 */
export function getLucideIcon(
  name: string | undefined,
  fallback: LucideIcon,
): LucideIcon;
export function getLucideIcon(
  name?: string,
  fallback?: LucideIcon | null,
): LucideIcon | null;
export function getLucideIcon(
  name?: string,
  fallback: LucideIcon | null = null,
): LucideIcon | null {
  if (!name) return fallback;
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? fallback;
}
