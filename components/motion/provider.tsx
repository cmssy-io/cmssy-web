"use client";

import { LazyMotion, domAnimation } from "motion/react";

/**
 * One provider for the whole site.
 *
 * `LazyMotion` + the `m` component ships a ~4.6kb synchronous core instead of
 * the full `motion` bundle; `domAnimation` adds the animation and gesture
 * features but not layout projection, which nothing here needs. Mounting it
 * once in the layout - rather than per block - is what keeps the feature
 * bundle from being loaded several times.
 *
 * Anything below this may import `m` from `motion/react`. Importing `motion`
 * instead defeats the whole arrangement.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
