"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type State = "false" | "true" | "end";

export function ScrollHint({
  children,
  className = "",
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("false");

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const slack = el.scrollWidth - el.clientWidth;
    if (slack <= 2) return setState("false");
    setState(el.scrollLeft >= slack - 2 ? "end" : "true");
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div
      ref={ref}
      data-overflow={state}
      onScroll={measure}
      style={{
        scrollbarColor:
          tone === "light"
            ? "rgba(16, 20, 28, 0.22) transparent"
            : "rgba(250, 250, 248, 0.18) transparent",
      }}
      className={`code-scroll overflow-x-auto ${className}`.trim()}
    >
      {children}
    </div>
  );
}
