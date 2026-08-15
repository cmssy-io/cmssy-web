import type { Transition } from "motion/react";

export const RESPONSE: Transition = {
  duration: 0.16,
  ease: [0.2, 0.9, 0.25, 1],
};

export const SETTLE: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
};

export const SEQUENCE_STEP: Transition = {
  duration: 0.42,
  ease: [0.2, 0.9, 0.25, 1],
};

export const AMBIENT: Transition = {
  duration: 8,
  ease: "linear",
  repeat: Infinity,
};

export const REVEAL_DISTANCE = 12;

export const STAGGER = 0.04;
export const STAGGER_MAX_CHILDREN = 5;
