"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  DESKTOP_BEAT,
  DESKTOP_LOOP_AT,
  LAST_STAGE,
  MOBILE_BEAT,
  type Step,
} from "./beat";

/** Below this the chassis cannot hold three surfaces, so it tells a shorter story. */
const COMPACT_QUERY = "(max-width: 639px)";

/**
 * The single clock. One timer owns the whole sequence; every surface is a pure
 * function of the stage it returns.
 *
 * It stops when the hero is off-screen (nobody is watching, and a paused RAF
 * is a paused battery) and never starts at all under `prefers-reduced-motion`,
 * where it reports the finished state instead - the last frame of the beat is
 * also its most legible one.
 */
export function useBeatClock<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) {
      setStage(LAST_STAGE);
      return;
    }
    if (!inView) return;

    const steps: Step[] = compact ? MOBILE_BEAT : DESKTOP_BEAT;
    const loopAt = compact ? null : DESKTOP_LOOP_AT;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      setStage(steps[i].stage);
      const current = steps[i].at;
      i += 1;
      if (i < steps.length) {
        timer = setTimeout(tick, steps[i].at - current);
      } else if (loopAt != null) {
        timer = setTimeout(() => {
          i = 0;
          tick();
        }, loopAt - current);
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, [inView, reduced, compact]);

  return { ref, stage, reduced: Boolean(reduced), compact };
}

/**
 * Character-by-character reveal, driven by the same stage as everything else.
 * Returns the whole string immediately once the stage has moved past it, so a
 * visitor arriving mid-beat never sees a half-typed instruction.
 */
export function useTyped(
  text: string,
  active: boolean,
  done: boolean,
  durationMs: number,
) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (done) {
      setLength(text.length);
      return;
    }
    if (!active) {
      setLength(0);
      return;
    }
    const per = Math.max(16, Math.floor(durationMs / Math.max(1, text.length)));
    const id = setInterval(() => {
      setLength((n) => (n >= text.length ? n : n + 1));
    }, per);
    return () => clearInterval(id);
  }, [text, active, done, durationMs]);

  return text.slice(0, length);
}
