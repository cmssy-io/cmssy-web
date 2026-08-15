"use client";

import { AnimatePresence, m, useTransform, type MotionValue } from "motion/react";

export const EL = "#00a8f0";
export const EL3 = "#5bc6f7";
export const FAINT = "rgba(250,250,248,.15)";
export const LABEL = "rgba(250,250,248,.42)";
export const DIM = "rgba(250,250,248,.3)";

/** the tapered head, approximated with three dashes so it needs no gradient */
const HEAD = [
  { k: 1, opacity: 0.22, width: 2 },
  { k: 0.52, opacity: 0.5, width: 2.4 },
  { k: 0.2, opacity: 1, width: 2.6 },
];

interface LitPathProps {
  d: string;
  /** length of this path in world units, for converting px to path fractions */
  worldLength: number;
  /** maps sequence progress to 0..1 along this path */
  sOf: (p: number) => number;
  progress: MotionValue<number>;
  streak: MotionValue<number>;
  /** 0 live, 1 rested: the drawn route cools instead of staying at full burn */
  settle: MotionValue<number>;
  color?: string;
  /** trail width */
  width?: number;
  /** opacity the trail cools to; the trunk keeps a touch more than the fan */
  rest?: number;
}

export function LitPath({
  d,
  worldLength,
  sOf,
  progress,
  streak,
  settle,
  color = EL,
  width = 2,
  rest = 0.3,
}: LitPathProps) {
  const trail = useTransform(progress, (p) => 1 - sOf(p));
  const trailO = useTransform(settle, [0, 1], [0.8, rest]);

  const a0 = useTransform(streak, (L) => `${(L * HEAD[0].k) / worldLength} 2`);
  const o0 = useTransform([progress, streak], ([p, L]: number[]) =>
    (L * HEAD[0].k) / worldLength - sOf(p),
  );
  const a1 = useTransform(streak, (L) => `${(L * HEAD[1].k) / worldLength} 2`);
  const o1 = useTransform([progress, streak], ([p, L]: number[]) =>
    (L * HEAD[1].k) / worldLength - sOf(p),
  );
  const a2 = useTransform(streak, (L) => `${(L * HEAD[2].k) / worldLength} 2`);
  const o2 = useTransform([progress, streak], ([p, L]: number[]) =>
    (L * HEAD[2].k) / worldLength - sOf(p),
  );

  return (
    <>
      <m.path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray="1 2"
        style={{ strokeDashoffset: trail, strokeOpacity: trailO }}
      />
      <m.path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeOpacity={HEAD[0].opacity}
        strokeWidth={HEAD[0].width}
        strokeLinecap="round"
        style={{ strokeDasharray: a0, strokeDashoffset: o0 }}
      />
      <m.path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeOpacity={HEAD[1].opacity}
        strokeWidth={HEAD[1].width}
        strokeLinecap="round"
        style={{ strokeDasharray: a1, strokeDashoffset: o1 }}
      />
      <m.path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeOpacity={HEAD[2].opacity}
        strokeWidth={HEAD[2].width}
        strokeLinecap="round"
        style={{ strokeDasharray: a2, strokeDashoffset: o2 }}
      />
    </>
  );
}

export function TransportDefs() {
  return (
    <defs>
      <filter id="tp-glow" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="tp-lift" x="-45%" y="-45%" width="190%" height="190%">
        <feDropShadow
          dx="0"
          dy="10"
          stdDeviation="16"
          floodColor="#000"
          floodOpacity="0.55"
        />
      </filter>
    </defs>
  );
}

/**
 * Two overlaid <text> nodes crossfading in place. tspan cannot be moved
 * independently, and AnimatePresence would reflow it, so the whole glyph is
 * its own absolutely positioned text element.
 */
export function RollingNumber({
  value,
  x,
  y,
  fill,
  reduced,
}: {
  value: number | string;
  x: number;
  y: number;
  fill: string;
  reduced: boolean;
}) {
  const common = {
    x,
    y,
    fill,
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    letterSpacing: ".1em",
  };
  if (reduced) return <text {...common}>{value}</text>;
  return (
    <AnimatePresence initial={false} mode="wait">
      <m.text
        key={String(value)}
        {...common}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.13, ease: [0.2, 0.9, 0.25, 1] }}
      >
        {value}
      </m.text>
    </AnimatePresence>
  );
}
