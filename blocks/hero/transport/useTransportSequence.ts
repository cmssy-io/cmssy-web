"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useVelocity,
  type AnimationPlaybackControls,
} from "motion/react";
import { P_BLK, P_FORK, P_GATE, P_MCP, P_MERGE } from "./geometry";

export const STATIONS = [
  { key: "mcp", p: P_MCP },
  { key: "block", p: P_BLK },
  { key: "fan", p: P_FORK },
  { key: "publish", p: P_GATE },
  { key: "frontend", p: 1 },
] as const;

export type StationKey = (typeof STATIONS)[number]["key"];

const DURATION = 4.85;

const KEYS = [0, 0, P_MCP, P_BLK, P_BLK, P_FORK, P_MERGE, P_MERGE, P_GATE, 1];

const TIMES = [0, 1.1, 1.45, 2.15, 2.55, 2.9, 3.9, 4.1, 4.35, 4.85].map(
  (t) => t / DURATION,
);

const EASE = [
  "linear",
  [0.55, 0, 0.62, 0.4],
  [0.12, 0.85, 0.25, 1],
  "linear",
  [0.42, 0, 0.25, 1],
  [0.45, 0, 0.45, 1],
  "linear",
  [0.5, 0, 0.4, 1],
  [0.1, 0.86, 0.2, 1],
] as const;

/** ms of stillness after arrival before anything ambient is allowed to start */
const STILLNESS_MS = 1350;

export interface Sequence {
  progress: ReturnType<typeof useMotionValue<number>>;
  streak: ReturnType<typeof useSpring>;
  wave: ReturnType<typeof useMotionValue<number>>;
  /** 0 while the run is live, 1 once the route has cooled to its resting state */
  settle: ReturnType<typeof useMotionValue<number>>;
  stage: number;
  ambient: boolean;
  scrubbing: StationKey | null;
  scrubTo: (key: StationKey | null) => void;
  start: () => void;
}

export function useTransportSequence(active: boolean): Sequence {
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const wave = useMotionValue(0);
  const settle = useMotionValue(0);

  const velocity = useVelocity(progress);
  const streak = useSpring(0, { stiffness: 520, damping: 46, restDelta: 0.4 });

  const [stage, setStage] = useState(0);
  const [ambient, setAmbient] = useState(false);
  const [scrubbing, setScrubbing] = useState<StationKey | null>(null);

  const main = useRef<AnimationPlaybackControls | null>(null);
  const scrub = useRef<AnimationPlaybackControls | null>(null);
  const played = useRef(false);
  const waveFired = useRef(false);
  const cooled = useRef(false);

  /* velocity, in progress-per-second, becomes a trailing length in world px */
  useMotionValueEvent(velocity, "change", (v) => {
    const speed = Math.abs(v);
    streak.set(Math.min(215, speed * 235));
  });

  useMotionValueEvent(progress, "change", (p) => {
    const next =
      p >= 0.998
        ? 5
        : p >= P_GATE
          ? 4
          : p >= P_FORK
            ? 3
            : p >= P_BLK
              ? 2
              : p >= P_MCP
                ? 1
                : 0;
    setStage((s) => (s === next ? s : next));

    if (next >= 4 && !waveFired.current) {
      waveFired.current = true;
      /* jumping straight to the spent state, or the ripple plays anyway when
         the reduced branch drops progress on the terminus */
      if (reduced) {
        wave.set(1);
      } else {
        wave.set(0);
        animate(wave, 1, { duration: 1.15, ease: [0.16, 0.72, 0.3, 1] });
      }
    }
    if (next < 4 && waveFired.current && p < P_FORK) {
      waveFired.current = false;
      wave.set(0);
    }
  });

  const start = useCallback(() => {
    if (played.current || reduced) return;
    played.current = true;
    main.current = animate(progress, KEYS, {
      duration: DURATION,
      times: TIMES,
      ease: EASE as unknown as never,
      onComplete: () => {
        cooled.current = true;
        /* the route stays legible but stops shouting, so the terminus and its
           counter are the last thing left holding light */
        animate(settle, 1, {
          duration: 1.3,
          delay: 0.35,
          ease: [0.33, 0, 0.2, 1],
        });
        window.setTimeout(() => setAmbient(true), STILLNESS_MS);
      },
    });
  }, [progress, settle, reduced]);

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      wave.set(1);
      settle.set(1);
      streak.jump(0);
      setStage(5);
      return;
    }
    if (active) start();
  }, [active, reduced, start, progress, wave, settle, streak]);

  useEffect(() => () => main.current?.stop(), []);

  const scrubTo = useCallback(
    (key: StationKey | null) => {
      if (reduced || !played.current) return;
      scrub.current?.stop();
      setScrubbing(key);
      if (key == null) {
        /* letting go returns the run to where it ended, not to wherever the
           pointer happened to leave it */
        scrub.current = animate(progress, 1, {
          type: "spring",
          stiffness: 150,
          damping: 28,
        });
        if (cooled.current) animate(settle, 1, { duration: 0.55, delay: 0.2 });
        return;
      }
      animate(settle, 0, { duration: 0.18 });
      const target = STATIONS.find((s) => s.key === key);
      if (!target) return;
      main.current?.stop();
      scrub.current = animate(progress, target.p, {
        type: "spring",
        stiffness: 190,
        damping: 26,
      });
    },
    [progress, settle, reduced],
  );

  return {
    progress,
    streak,
    wave,
    settle,
    stage,
    ambient,
    scrubbing,
    scrubTo,
    start,
  };
}
