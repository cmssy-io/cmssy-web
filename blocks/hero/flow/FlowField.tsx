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
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (mobile === null) return null;
  return (
    <div className="hero-flow__field">
      <FlowScene key={String(mobile)} mobile={mobile} />
    </div>
  );
}
