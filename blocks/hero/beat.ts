export const Stage = {
  REST: 0,
  TYPING: 1,
  TOOLS: 2,
  DRAFT: 3,
  SIGNAL_CANVAS: 4,
  DOCK: 5,
  INSPECTOR: 6,
  SIGNAL_CODE: 7,
  PUBLISHED: 8,
} as const;

export type Step = { stage: number; at: number };

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

export const MOBILE_BEAT: Step[] = [
  { stage: Stage.REST, at: 0 },
  { stage: Stage.TYPING, at: 400 },
  { stage: Stage.DOCK, at: 2200 },
  { stage: Stage.SIGNAL_CODE, at: 3400 },
  { stage: Stage.PUBLISHED, at: 4200 },
];

export const LAST_STAGE = Stage.PUBLISHED;
