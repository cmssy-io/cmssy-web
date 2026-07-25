"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Site-wide theme switch. The document's `data-theme` is set before paint by
 * the inline script in the root layout, so this only mirrors what is already
 * on screen and writes the user's choice back.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("cmssy-theme", next);
    } catch {
      // storage unavailable (private mode) - the theme still holds for this session
    }
  };

  // Until the effect runs the rendered icon would be a guess, and a wrong one
  // flashes on every load. An empty button of the right size does not.
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
