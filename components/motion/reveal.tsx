"use client";

import { m, useReducedMotion } from "motion/react";
import {
  REVEAL_DISTANCE,
  SETTLE,
  STAGGER,
  STAGGER_MAX_CHILDREN,
} from "./presets";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  index?: number;
  as?: "div" | "li" | "figure" | "span";
};

export function Reveal({
  children,
  className,
  index = 0,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = m[as];

  if (reduced) {
    return (
      <Tag className={className} data-reveal="">
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      data-reveal=""
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
