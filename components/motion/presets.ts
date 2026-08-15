import type { Transition } from "motion/react";

/**
 * The four tempos. Every animation on the site picks one of these; a component
 * that needs a fifth is a design decision, not an implementation detail.
 */

/** Response - something the visitor just did. Must feel instant. */
export const RESPONSE: Transition = { duration: 0.16, ease: [0.2, 0.9, 0.25, 1] };

/** Settle - something arriving on its own. The site's default. */
export const SETTLE: Transition = { type: "spring", stiffness: 260, damping: 30 };

/** Sequence - a narrated beat. Only the hero is allowed one. */
export const SEQUENCE_STEP: Transition = { duration: 0.42, ease: [0.2, 0.9, 0.25, 1] };

/** Ambient - background life. Never faster than 6s, never louder than 4%. */
export const AMBIENT: Transition = { duration: 8, ease: "linear", repeat: Infinity };

/** Reveal travels 12px. Further reads as a slide; less reads as a glitch. */
export const REVEAL_DISTANCE = 12;

/** Stagger between siblings, capped at five children before it feels like a list loading. */
export const STAGGER = 0.04;
export const STAGGER_MAX_CHILDREN = 5;
