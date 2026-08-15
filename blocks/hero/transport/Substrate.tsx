"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { WORLD, X_GATE, axisY, xAt } from "./geometry";

interface SubstrateProps {
  progress: MotionValue<number>;
  wave: MotionValue<number>;
  ambient: boolean;
  reduced: boolean;
  /** fewer, coarser lines on small or slow devices */
  coarse: boolean;
}

const BEND_SIGMA = 95;
const BEND_AMP = 9;
const RING_BAND = 46;
const RING_AMP = 13;
const RING_MAX = 224;
/** beyond this the bend is under a tenth of a pixel, so the line is untouched */
const BEND_REACH = 265;

export function Substrate({
  progress,
  wave,
  ambient,
  reduced,
  coarse,
}: SubstrateProps) {
  const group = useRef<SVGGElement>(null);
  const lines = useRef<SVGPolylineElement[]>([]);
  const drift = useRef(0);
  const buf = useRef<string[]>([]);

  const { rows, xs, base } = useMemo(() => {
    const step = coarse ? 84 : 42;
    const dx = coarse ? 34 : 20;
    const rows: number[] = [];
    for (let y = 74; y <= 830; y += step) rows.push(y);
    const xs: number[] = [];
    for (let x = WORLD.left; x <= WORLD.right + dx; x += dx) xs.push(x);
    const base = rows.map((y) =>
      xs.map((x) => `${x},${y.toFixed(1)}`).join(" "),
    );
    return { rows, xs, base };
  }, [coarse]);

  const paint = useCallback(
    (px: number, w: number, t: number) => {
      const out = buf.current;
      const ringR = w * RING_MAX;
      const ringAmp = RING_AMP * (1 - w * 0.6);
      const ringOn = w > 0.001 && w < 0.999;
      const cx = X_GATE;
      const cy = axisY(X_GATE);
      const payloadY = axisY(px);

      for (let r = 0; r < rows.length; r++) {
        const ry = rows[r];
        const nearBend = Math.abs(ry - payloadY) < BEND_REACH;
        const nearRing =
          ringOn && Math.abs(Math.abs(ry - cy) - ringR) < ringR + RING_BAND * 3;
        const wob = t === 0 ? 0 : Math.sin(t + r * 0.7) * 1.5;

        if (!nearBend && !nearRing && wob === 0) {
          const el = lines.current[r];
          if (el && el.dataset.state !== "flat") {
            el.setAttribute("points", base[r]);
            el.dataset.state = "flat";
          }
          continue;
        }

        const dir = ry < payloadY ? 1 : -1;
        for (let i = 0; i < xs.length; i++) {
          const x = xs[i];
          let y = ry + wob;
          if (nearBend) {
            const u = (x - px) / BEND_SIGMA;
            if (u > -3.2 && u < 3.2) y += dir * BEND_AMP * Math.exp(-u * u);
          }
          if (nearRing) {
            const ddx = x - cx;
            const ddy = ry - cy;
            const d = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
            const u = (d - ringR) / RING_BAND;
            if (u > -3 && u < 3) y += (ddy / d) * ringAmp * Math.exp(-u * u);
          }
          out[i] = `${x},${y.toFixed(1)}`;
        }
        const el = lines.current[r];
        if (el) {
          el.setAttribute("points", out.join(" "));
          el.dataset.state = "bent";
        }
      }
    },
    [rows, xs, base],
  );

  useEffect(() => {
    buf.current = new Array(xs.length).fill("");
  }, [xs]);

  useMotionValueEvent(progress, "change", (p) => {
    if (reduced) return;
    paint(xAt(p), wave.get(), drift.current);
  });

  useMotionValueEvent(wave, "change", (w) => {
    if (reduced) return;
    paint(xAt(progress.get()), w, drift.current);
  });

  /* ambient: a slow breathing drift, only once the sequence has settled */
  useEffect(() => {
    if (!ambient || reduced) return;
    const el = group.current;
    if (!el) return;

    let raf = 0;
    let running = true;
    let last = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      if (!running) return;
      /* 20fps is plenty for a 14s breath and leaves the phone alone */
      if (now - last > 50) {
        last = now;
        drift.current = ((now - t0) / 14000) * Math.PI * 2;
        paint(xAt(progress.get()), wave.get(), drift.current);
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf) raf = requestAnimationFrame(tick);
        if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(el);

    return () => {
      running = false;
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ambient, reduced, paint, progress, wave]);

  return (
    <g ref={group} aria-hidden>
      {rows.map((y, i) => (
        <polyline
          key={y}
          ref={(el) => {
            if (el) lines.current[i] = el;
          }}
          points={base[i]}
          data-state="flat"
          fill="none"
          stroke="rgba(250,250,248,.07)"
          strokeWidth={1}
        />
      ))}
    </g>
  );
}
