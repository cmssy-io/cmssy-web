"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
import { P_BLK, TERM, X_TERM, axisY } from "./geometry";
import type { Sequence } from "./useTransportSequence";

const PAY_R = 5.5;

/* The payload carries its own translate, so every target is written relative to
   wherever the payload is standing when it takes that shape. */
const BLOCK_LOCAL = { x: -38, y: -34, w: 76, h: 68, rx: 8 };
const TERM_LOCAL = {
  x: TERM.x - X_TERM,
  y: TERM.y - axisY(X_TERM),
  w: TERM.w,
  h: TERM.h,
  rx: 10,
};

/** the handle length that turns four cubics into a circle */
const CIRC = 0.552284749831;

/* Drawn without GSAP so the payload is on screen from the first paint - the
   library only arrives once the chunk lands, and the run may start before it. */
export const DOT_D = (() => {
  const r = PAY_R;
  const k = r * CIRC;
  return `M${r},0C${r},${k},${k},${r},0,${r},${-k},${r},${-r},${k},${-r},0,${-r},${-k},${-k},${-r},0,${-r},${k},${-r},${r},${-k},${r},0z`;
})();

const SVG_NS = "http://www.w3.org/2000/svg";

/* The sources are built detached and thrown away once their `d` is read, so no
   hidden geometry ends up in the rendered document and GSAP never swaps a node
   React believes it owns. */
function rectPath(
  box: typeof BLOCK_LOCAL,
  toPath: (el: SVGRectElement) => SVGPathElement[],
) {
  const el = document.createElementNS(SVG_NS, "rect");
  el.setAttribute("x", String(box.x));
  el.setAttribute("y", String(box.y));
  el.setAttribute("width", String(box.w));
  el.setAttribute("height", String(box.h));
  el.setAttribute("rx", String(box.rx));
  return toPath(el)[0]?.getAttribute("d") ?? "";
}

/* The dwell holds progress still at P_BLK, so the shape has to be fully a block
   by the time it arrives and only start unfolding once it leaves. */
const B_IN = 0.372;
const B_OUT = 0.458;
/* the terminus takes shape over the last stretch of the run out of the gate */
const T_IN = 0.962;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

function blockAmount(p: number) {
  if (p <= B_IN || p >= B_OUT) return 0;
  return p < P_BLK
    ? smooth((p - B_IN) / (P_BLK - B_IN))
    : 1 - smooth((p - P_BLK) / (B_OUT - P_BLK));
}

function termAmount(p: number) {
  return smooth((p - T_IN) / (1 - T_IN));
}

/**
 * GSAP is used here only as a shape solver: it never runs a clock of its own.
 * Both tweens stay paused and are scrubbed from the sequence's `progress`, so
 * the run keeps a single source of truth. It is also loaded on demand, so the
 * mobile diagram - which has no morph - never pays for the library.
 */
export function useMorph(progress: Sequence["progress"], enabled: boolean) {
  const shape = useRef<SVGPathElement>(null);
  const toBlock = useRef<gsap.core.Tween | null>(null);
  const toTerm = useRef<gsap.core.Tween | null>(null);
  const applied = useRef({ block: 0, term: 0 });

  useEffect(() => {
    const el = shape.current;
    if (!el || !enabled) return;
    let live = true;

    /* The desktop scene mounts for one frame everywhere, because the media
       query can only be read on the client - so the fetch waits a frame and
       lets the mobile swap cancel it before it costs anyone anything. */
    const frame = requestAnimationFrame(async () => {
      const [{ gsap }, { MorphSVGPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/MorphSVGPlugin"),
      ]);
      if (!live) return;
      gsap.registerPlugin(MorphSVGPlugin);
      const toPath = (r: SVGRectElement) =>
        MorphSVGPlugin.convertToPath(r) as SVGPathElement[];

      const common = { paused: true, ease: "none" as const, duration: 1 };
      const lit = { attr: { "fill-opacity": 0, "stroke-opacity": 1 } };
      toBlock.current = gsap.to(el, {
        ...common,
        ...lit,
        morphSVG: rectPath(BLOCK_LOCAL, toPath),
      });
      toTerm.current = gsap.to(el, {
        ...common,
        ...lit,
        morphSVG: rectPath(TERM_LOCAL, toPath),
      });
    });

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      toBlock.current?.kill();
      toTerm.current?.kill();
      toBlock.current = null;
      toTerm.current = null;
      applied.current = { block: 0, term: 0 };
    };
  }, [enabled]);

  useMotionValueEvent(progress, "change", (p) => {
    const b = toBlock.current;
    const t = toTerm.current;
    if (!b || !t) return;
    const term = termAmount(p);
    const block = term > 0 ? 0 : blockAmount(p);
    const was = applied.current;
    /* most of the run is a plain dot, and rewriting the same path every frame
       for it costs more than the morph itself */
    if (block === was.block && term === was.term) return;
    applied.current = { block, term };
    /* Only one tween may own `d` at a time, so the idle one is rewound first -
       but only when it has something to rewind. GSAP skips a tween already
       standing at the requested time, so a needless rewind of the idle tween
       would write its start shape and then get no answer from the active one. */
    if (term > 0) {
      if (was.block !== 0) b.progress(0);
      t.progress(term);
    } else {
      if (was.term !== 0) t.progress(0);
      b.progress(block);
    }
  });

  return shape;
}
