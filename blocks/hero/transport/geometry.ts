export const WORLD = { left: -620, right: 1200, height: 860 };

/** the transport sits in the lower two thirds; the type owns everything above */
export const AXIS_BASE = 610;

export const X_START = -170;
export const X_MCP = 112;
export const X_BLK = 272;
export const F_A = 400;
export const F_B = 470;
export const F_C = 720;
export const F_D = 850;
export const X_BUS = 902;
export const X_GATE = 940;
export const X_TERM = 990;

export const TERM = { x: 990, y: 598, w: 190, h: 146 };
export const TRACK_OFFSETS = [-96, -48, 0, 48, 96] as const;
export const TRACK_LAG = [44, 20, 0, 20, 44] as const;

export const axisY = (x: number) => AXIS_BASE + 0.055 * x;
export const trackY = (offset: number) => axisY(595) + offset;

const SPAN = X_TERM - X_START;

export const xAt = (p: number) => X_START + p * SPAN;
export const pAt = (x: number) => (x - X_START) / SPAN;

export const P_MCP = pAt(X_MCP);
export const P_BLK = pAt(X_BLK);
export const P_FORK = pAt(F_A);
export const P_MERGE = pAt(F_D);
export const P_GATE = pAt(X_GATE);

const smooth = (t: number) => t * t * (3 - 2 * t);

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * How far a fan track has separated from the trunk at x, 0 at the fork and
 * 0 again at the merge. Cubics below place their x-controls at the thirds so
 * x is linear in t, which makes the drawn curve exactly this function.
 */
export function fanBlend(x: number) {
  if (x <= F_A || x >= F_D) return 0;
  if (x < F_B) return smooth((x - F_A) / (F_B - F_A));
  if (x <= F_C) return 1;
  return smooth((F_D - x) / (F_D - F_C));
}

export function trackYAt(x: number, offset: number) {
  const base = axisY(x);
  if (offset === 0 || x <= F_A || x >= F_D) return base;
  const target = trackY(offset);
  const k = fanBlend(x);
  return base + (target - base) * k;
}

function thirds(x0: number, x1: number) {
  const d = (x1 - x0) / 3;
  return [x0 + d, x0 + 2 * d];
}

export function trunkPath() {
  return `M${WORLD.left},${axisY(WORLD.left)} L${F_A},${axisY(F_A)}`;
}

export function busPath() {
  return `M${F_D},${axisY(F_D)} L${X_TERM + 26},${axisY(X_TERM + 26)}`;
}

export function trackPath(offset: number) {
  if (offset === 0) {
    return `M${F_A},${axisY(F_A)} L${F_D},${axisY(F_D)}`;
  }
  const y0 = axisY(F_A);
  const yb = trackY(offset);
  const y1 = axisY(F_D);
  const [a1, a2] = thirds(F_A, F_B);
  const [c1, c2] = thirds(F_C, F_D);
  return [
    `M${F_A},${y0}`,
    `C${a1},${y0} ${a2},${yb} ${F_B},${yb}`,
    `L${F_C},${yb}`,
    `C${c1},${yb} ${c2},${y1} ${F_D},${y1}`,
  ].join(" ");
}

/** The whole journey as one path, used for the trunk payload and the trail. */
export function spinePath() {
  return `M${X_START},${axisY(X_START)} L${X_TERM + 26},${axisY(X_TERM + 26)}`;
}

export interface Track {
  offset: number;
  d: string;
  length: number;
  /** normalised arc position (0..1) of a given x */
  s: (x: number) => number;
  y: (x: number) => number;
}

function buildTrack(offset: number): Track {
  const STEPS = 192;
  const xs = new Float32Array(STEPS + 1);
  const cum = new Float32Array(STEPS + 1);
  let prevX = F_A;
  let prevY = axisY(F_A);
  let total = 0;
  xs[0] = F_A;
  cum[0] = 0;
  for (let i = 1; i <= STEPS; i++) {
    const x = F_A + ((F_D - F_A) * i) / STEPS;
    const y = trackYAt(x, offset);
    total += Math.hypot(x - prevX, y - prevY);
    xs[i] = x;
    cum[i] = total;
    prevX = x;
    prevY = y;
  }

  return {
    offset,
    d: trackPath(offset),
    length: total,
    y: (x: number) => trackYAt(x, offset),
    s: (x: number) => {
      if (x <= F_A) return 0;
      if (x >= F_D) return 1;
      const t = ((x - F_A) / (F_D - F_A)) * STEPS;
      const i = Math.min(STEPS - 1, Math.floor(t));
      const f = t - i;
      return (cum[i] + (cum[i + 1] - cum[i]) * f) / total;
    },
  };
}

export const TRACKS: Track[] = TRACK_OFFSETS.map(buildTrack);

/** Payload x on track i, including its physical lag through the plateau. */
export function trackXAt(x: number, index: number) {
  const lag = TRACK_LAG[index] * fanBlend(x);
  return Math.max(F_A, x - lag);
}

export const SPINE_LENGTH = Math.hypot(
  X_TERM + 26 - X_START,
  axisY(X_TERM + 26) - axisY(X_START),
);

export const spineS = (x: number) =>
  clamp01((x - X_START) / (X_TERM + 26 - X_START));

/* ---------------------------------------------------------------- mobile */

export const M = {
  width: 390,
  height: 692,
  spine: 132,
  yStart: -40,
  yMcp: 54,
  yBlk: 150,
  fanA: 214,
  fanB: 258,
  fanC: 386,
  fanD: 430,
  /** the locale codes sit mid-run, not at its end, so the fan reads as a band */
  yLocale: 322,
  yGate: 484,
  yTerm: 552,
  offsets: [-84, -42, 0, 42, 84] as const,
};

const M_SPAN = M.yTerm - M.yStart;

/* One sequence drives both scenes, so the mobile spine has to hit its stations
   at the same progress fractions the desktop axis does. The vertical layout is
   spaced for reading, not scaled from x, so the map between them is piecewise. */
const M_STOPS: ReadonlyArray<readonly [number, number]> = [
  [0, M.yStart],
  [P_MCP, M.yMcp],
  [P_BLK, M.yBlk],
  [P_FORK, M.fanA],
  [P_MERGE, M.fanD],
  [P_GATE, M.yGate],
  [1, M.yTerm],
];

export function mYAt(p: number) {
  if (p <= 0) return M.yStart;
  if (p >= 1) return M.yTerm;
  for (let i = 1; i < M_STOPS.length; i++) {
    const [p1, y1] = M_STOPS[i];
    if (p > p1) continue;
    const [p0, y0] = M_STOPS[i - 1];
    return y0 + ((p - p0) / (p1 - p0)) * (y1 - y0);
  }
  return M.yTerm;
}

/** the mobile world is shorter than the desktop one, so the streak scales down */
export const M_STREAK_SCALE = M_SPAN / SPAN;

export function mFanBlend(y: number) {
  if (y <= M.fanA || y >= M.fanD) return 0;
  if (y < M.fanB) return smooth((y - M.fanA) / (M.fanB - M.fanA));
  if (y <= M.fanC) return 1;
  return smooth((M.fanD - y) / (M.fanD - M.fanC));
}

export function mTrackXAt(y: number, offset: number) {
  if (offset === 0) return M.spine;
  return M.spine + offset * mFanBlend(y);
}

export function mTrackPath(offset: number) {
  if (offset === 0) return `M${M.spine},${M.fanA} L${M.spine},${M.fanD}`;
  const x1 = M.spine + offset;
  const [a1, a2] = thirds(M.fanA, M.fanB);
  const [c1, c2] = thirds(M.fanC, M.fanD);
  return [
    `M${M.spine},${M.fanA}`,
    `C${M.spine},${a1} ${x1},${a2} ${x1},${M.fanB}`,
    `L${x1},${M.fanC}`,
    `C${x1},${c1} ${M.spine},${c2} ${M.spine},${M.fanD}`,
  ].join(" ");
}

export function mSpinePath() {
  return `M${M.spine},${M.yStart} L${M.spine},${M.yTerm}`;
}

export const mSpineS = (y: number) => clamp01((y - M.yStart) / M_SPAN);

export const mTrackS = (y: number) =>
  clamp01((y - M.fanA) / (M.fanD - M.fanA));
