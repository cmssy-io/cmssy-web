"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Wraps every /docs page. Carries the `.docs-shell` class that scopes the dark
// token palette (see styles/main.css), so dark mode never leaks onto the
// light-only marketing surface. Hosts the docs-only theme toggle.
export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell min-h-screen bg-background text-foreground">
      {children}
      <DocsThemeToggle />
    </div>
  );
}

function DocsThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("cmssy-docs-theme", next);
    } catch {
      // storage unavailable (private mode) — theme still applies for the session
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className="fixed bottom-5 right-5 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-lg transition-colors hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
