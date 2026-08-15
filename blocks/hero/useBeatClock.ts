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

const COMPACT_QUERY = "(max-width: 639px)";

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
