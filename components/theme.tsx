"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";

export type Theme = "light" | "dark";

function storedTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "dark" || value === "light") return value;
  } catch {
    // storage unavailable (private mode) - fall back to the system preference
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const ThemeContext = createContext<{
  theme: Theme | null;
  toggle: () => void;
} | null>(null);

/**
 * The single owner of the theme.
 *
 * `data-theme` lives on `<html>`, which React 19 treats as a singleton: when
 * the root layout remounts it re-acquires the element and drops every
 * attribute that is not one of its props. This layout sits inside the
 * `[[...path]]` segment, so *every* navigation remounts it and the theme would
 * be wiped. Re-asserting it in a layout effect - which runs after the commit
 * but before the browser paints - puts it back in the same frame, so the reset
 * is never visible.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const current = storedTheme();
    document.documentElement.dataset.theme = current;
    setTheme(current);
  }, [pathname]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // storage unavailable - the choice still holds for this page view
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  // Until the first layout effect runs the icon would be a guess, and a wrong
  // one flashes on every load. An empty button of the right size does not.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : null}
    </button>
  );
}
