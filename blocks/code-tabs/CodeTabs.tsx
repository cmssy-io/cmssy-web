"use client";

import { useState } from "react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { codeTabsProps } from "./block";

export default function CodeTabs({
  content,
}: BlockProps<typeof codeTabsProps>) {
  const {
    fig = "FIG 1.0",
    eyebrow = "",
    heading = "",
    description = "",
    tabs = [],
  } = content;
  const [active, setActive] = useState(0);

  if (tabs.length === 0) {
    return (
      <Container className="py-6">
        <div data-block="code-tabs-empty" />
      </Container>
    );
  }

  const tab = tabs[Math.min(active, tabs.length - 1)];

  return (
    <section id="code" className="bg-paper py-24">
      <Container>
        <div className="max-w-3xl">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-ink text-balance">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-ink/60">{description}</p>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-ink/10 bg-ink shadow-2xl shadow-ink/10">
          <div className="flex items-center gap-1 border-b border-paper/10 px-3 pt-2">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-t-md px-4 py-2.5 font-mono text-[13px] transition-colors ${
                  i === active
                    ? "border-b-2 border-elektryk text-paper"
                    : "text-paper/50 hover:text-paper/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto p-6">
            {tab.comment && (
              <div className="mb-3 font-mono text-[13px] text-paper/40">
                {tab.comment}
              </div>
            )}
            <pre className="font-mono text-[13.5px] leading-relaxed whitespace-pre text-paper/90">
              {tab.code}
            </pre>
          </div>
        </div>
      </Container>
    </section>
  );
}
