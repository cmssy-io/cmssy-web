"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FlowScene = dynamic(() => import("./FlowScene").then((m) => m.FlowScene), {
  ssr: false,
});

const MOBILE_QUERY = "(max-width: 1023px)";

export function FlowField() {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    mq.addEventListener("change", sync);
    // The field is decoration: load three.js and start the GL context only
    // once the page has loaded and the main thread is idle, so neither lands
    // in the first paint or the blocking time.
    let idle = 0;
    let timer = 0;
    const start = () => {
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(sync, { timeout: 2000 });
      } else {
        timer = window.setTimeout(sync, 200);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  if (mobile === null) return null;
  return (
    <div className="hero-flow__field">
      <FlowScene key={String(mobile)} mobile={mobile} />
    </div>
  );
}
