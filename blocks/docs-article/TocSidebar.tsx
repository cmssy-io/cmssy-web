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
      <div className="sticky top-20">
        {title && <h4 className="text-sm font-semibold mb-4">{title}</h4>}
        <nav className="space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                block text-sm py-1 transition-colors
                ${item.level === 3 ? "pl-4" : ""}
                ${
                  activeId === item.id
                    ? "text-violet-600 font-medium"
                    : "text-muted-foreground hover:text-foreground"
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
