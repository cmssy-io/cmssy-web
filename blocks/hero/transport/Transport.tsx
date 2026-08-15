"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { M, WORLD } from "./geometry";
import { TransportDesktop } from "./TransportDesktop";
import { TransportMobile } from "./TransportMobile";
import { useTransportSequence } from "./useTransportSequence";
import type { TransportLabels } from "./labels";

const MOBILE_QUERY = "(max-width: 1023px)";
const MOBILE_VIEWBOX = `0 0 ${M.width} ${M.height}`;

/* the world is 860 tall but its last content sits at ~750, so the visible
   bottom is pinned above the empty tail */
const DESKTOP_H = 792;
const DESKTOP_RIGHT = 1200;
/** never crop past the inlet annotation on the left */
const MIN_WORLD_W = 1115;

/* The widest the world ever gets, and the box the server renders. Whatever the
   first measurement turns out to be, starting here means the correction is a
   narrowing rather than a 620-unit lurch sideways from a box that no viewport
   ever produces. */
const FULL_W = DESKTOP_RIGHT - WORLD.left;
const INITIAL_BOX = { x: WORLD.left, y: 0, w: FULL_W, h: DESKTOP_H };

/* Reading layout in an effect is a paint too late - the browser has already
   shown the server's box by then, which is the whole jump. useLayoutEffect
   runs before that paint; on the server there is nothing to measure, and
   calling it there only earns a warning. */
const useMeasure = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Transport({ labels }: { labels: TransportLabels }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = Boolean(useReducedMotion());
  /* not `once`: the loop parks itself whenever the hero leaves the frame */
  const inView = useInView(host, { amount: 0.4 });

  const [mobile, setMobile] = useState(false);
  /* the server cannot know which scene applies, so the stacked layout stays
     hidden until the media query has been read once */
  const [ready, setReady] = useState(false);
  const [box, setBox] = useState(INITIAL_BOX);

  const seq = useTransportSequence(inView);

  /* The world is pinned to its right and bottom edges: the terminus never
     shifts and the transport band is always in frame. Extra height shows more
     empty substrate above; extra width bleeds more trunk off the left.

     Scene choice and box both land here, before the first client paint, so the
     server's placeholder never gets shown and then corrected. */
  useMeasure(() => {
    const el = host.current;
    if (!el) return;

    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);

    const fit = (width: number, height: number) => {
      if (!width || !height) return;
      const w = Math.min(FULL_W, Math.max(MIN_WORLD_W, width * 0.95));
      const h = Math.min(DESKTOP_H, (height * w) / width);
      setBox({ x: DESKTOP_RIGHT - w, y: DESKTOP_H - h, w, h });
    };

    /* once synchronously, so the first painted frame is already the right box */
    const rect = el.getBoundingClientRect();
    fit(rect.width, rect.height);

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      fit(width, height);
    });
    ro.observe(el);

    setReady(true);

    return () => {
      mq.removeEventListener("change", sync);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={host} className="tp-host">
      <svg
        className="tp-svg"
        data-ready={ready ? "1" : "0"}
        viewBox={
          mobile ? MOBILE_VIEWBOX : `${box.x} ${box.y} ${box.w} ${box.h}`
        }
        preserveAspectRatio={mobile ? "xMidYMid meet" : "xMaxYMax slice"}
        role="img"
        aria-label={labels.diagramAria}
      >
        {mobile ? (
          <TransportMobile seq={seq} reduced={reduced} labels={labels} />
        ) : (
          <TransportDesktop seq={seq} reduced={reduced} labels={labels} />
        )}
      </svg>
    </div>
  );
}
