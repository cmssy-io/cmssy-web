"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FlowScene = dynamic(() => import("./FlowScene").then((m) => m.FlowScene), {
  ssr: false,
});

const DESKTOP_QUERY = "(min-width: 1024px)";

export function FlowField() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!enabled) return null;
  return (
    <div className="hero-transport__flow">
      <FlowScene />
    </div>
  );
}
