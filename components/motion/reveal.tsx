"use client";

import { m, useReducedMotion } from "motion/react";
import { REVEAL_DISTANCE, SETTLE, STAGGER, STAGGER_MAX_CHILDREN } from "./presets";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Index within a staggered group. Beyond the fifth child the delay stops growing. */
  index?: number;
  as?: "div" | "li" | "figure" | "span";
};

/**
 * The entire site-wide scroll story: 12px and a fade, once, on settle.
 *
 * Applied to headings and figures only. Never to a band background - a
 * section that fades in as a whole is the thing that makes a page feel like a
 * template.
 *
 * Under `prefers-reduced-motion` this renders the final state directly. It
 * must never leave an element invisible: that is the failure mode the CSS
 * overrides it replaces got right, and the one worth protecting.
 */
export function Reveal({ children, className, index = 0, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = m[as];

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: REVEAL_DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        ...SETTLE,
        delay: Math.min(index, STAGGER_MAX_CHILDREN - 1) * STAGGER,
      }}
    >
      {children}
    </Tag>
  );
}
