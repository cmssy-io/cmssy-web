"use client";

import { useEffect, useRef, useState } from "react";
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

export function Transport({ labels }: { labels: TransportLabels }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = Boolean(useReducedMotion());
  const inView = useInView(host, { amount: 0.4, once: true });

  const [mobile, setMobile] = useState(false);
  /* the server cannot know which scene applies, so the stacked layout stays
     hidden until the media query has been read once */
  const [ready, setReady] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [box, setBox] = useState({ x: 0, y: 0, w: DESKTOP_RIGHT, h: DESKTOP_H });

  const seq = useTransportSequence(inView);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);

    const cores = navigator.hardwareConcurrency ?? 8;
    setCoarse(mq.matches || cores <= 4);
    setReady(true);

    return () => mq.removeEventListener("change", sync);
  }, []);

  /* The world is pinned to its right and bottom edges: the terminus never
     shifts and the transport band is always in frame. Extra height shows more
     empty substrate above; extra width bleeds more trunk off the left. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      const w = Math.min(
        DESKTOP_RIGHT - WORLD.left,
        Math.max(MIN_WORLD_W, width * 0.95),
      );
      const h = Math.min(DESKTOP_H, (height * w) / width);
      setBox({ x: DESKTOP_RIGHT - w, y: DESKTOP_H - h, w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
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
          <TransportDesktop
            seq={seq}
            reduced={reduced}
            coarse={coarse}
            labels={labels}
          />
        )}
      </svg>
    </div>
  );
}
