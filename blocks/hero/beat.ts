/**
 * The hero beat: one clock, one story.
 *
 * The old mockup ran three unrelated CSS loops on a shared 12s duration, so
 * nothing on screen caused anything else. Here every surface reads the same
 * `stage`, which is why the sequence can argue something: the content moves
 * while the code stays still.
 *
 * Every tool name and block type in the beat was executed against a live
 * workspace before it was written down. Nothing here depicts an action the
 * product cannot perform.
 */

export const Stage = {
  /** At rest, showing this page's own content. */
  REST: 0,
  /** The MCP instruction types in. */
  TYPING: 1,
  /** Tool calls tick through. */
  TOOLS: 2,
  /** The page now has unpublished draft changes. */
  DRAFT: 3,
  /** Signal travels from the AI panel to the canvas. */
  SIGNAL_CANVAS: 4,
  /** The features block docks into the canvas. */
  DOCK: 5,
  /** The inspector gains that block's real fields. */
  INSPECTOR: 6,
  /** Signal travels to the code strip: data changes, code does not. */
  SIGNAL_CODE: 7,
  /** Published again. */
  PUBLISHED: 8,
} as const;

export type Step = { stage: number; at: number };

/** Six beats in seven seconds, then a hold, then round again. */
export const DESKTOP_BEAT: Step[] = [
  { stage: Stage.REST, at: 0 },
  { stage: Stage.TYPING, at: 600 },
  { stage: Stage.TOOLS, at: 1900 },
  { stage: Stage.DRAFT, at: 2200 },
  { stage: Stage.SIGNAL_CANVAS, at: 2400 },
  { stage: Stage.DOCK, at: 2700 },
  { stage: Stage.INSPECTOR, at: 3200 },
  { stage: Stage.SIGNAL_CODE, at: 3900 },
  { stage: Stage.PUBLISHED, at: 4600 },
];

export const DESKTOP_LOOP_AT = 7000;

/**
 * Not a scaled-down desktop beat - a shorter one. Two surfaces, four beats,
 * and it plays once rather than looping, because a loop in a thumb's reach is
 * a distraction rather than a demonstration.
 */
export const MOBILE_BEAT: Step[] = [
  { stage: Stage.REST, at: 0 },
  { stage: Stage.TYPING, at: 400 },
  { stage: Stage.DOCK, at: 2200 },
  { stage: Stage.SIGNAL_CODE, at: 3400 },
  { stage: Stage.PUBLISHED, at: 4200 },
];

export const LAST_STAGE = Stage.PUBLISHED;
