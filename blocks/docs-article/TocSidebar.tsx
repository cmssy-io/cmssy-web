"use client";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocSidebarProps {
  items: TocItem[];
  title?: string;
}

/**
 * Client-only TOC sidebar — handles scroll-based active heading tracking.
 * The heading list itself is SSR'd; only the highlight state needs the browser.
 */
export function TocSidebar({ items, title }: TocSidebarProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-[calc(var(--site-chrome,4rem)+var(--docs-tabs,0px)+1rem)] max-h-[calc(100dvh-var(--site-chrome,4rem)-var(--docs-tabs,0px)-2rem)] overflow-y-auto overscroll-contain">
        {title && (
          <h4 className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </h4>
        )}
        <nav className="border-l border-border">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                -ml-px block border-l py-1 text-[13px] transition-colors
                ${item.level === 3 ? "pl-7" : "pl-3"}
                ${
                  activeId === item.id
                    ? "border-elektryk font-medium text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
