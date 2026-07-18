"use client";

import { useState } from "react";
import type { BlockProps } from "@cmssy/react";
import { CodeSnippet } from "@/components/code-snippet";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { codeTabsProps } from "./block";

export default function CodeTabs({
  content,
}: BlockProps<typeof codeTabsProps>) {
  const {
    fig = "",
    eyebrow = "",
    heading = "",
    description = "",
    equalHeight = true,
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

  const activeIndex = Math.min(active, tabs.length - 1);
  const renderTab = (t: (typeof tabs)[number]) => {
    const code = t.comment ? `${t.comment}\n${t.code}` : t.code;
    const showCaret = t.label?.toUpperCase().includes("MCP");
    return <CodeSnippet code={code} caret={showCaret} />;
  };

  return (
    <section id="code" className="bg-paper py-24">
      <Container>
        <div className="max-w-3xl">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-4 text-4xl font-bold tracking-tight text-ink text-balance">
            {heading}
          </h2>
          {description && (
            <p className="mt-3 max-w-lg text-lg text-ink/60">{description}</p>
          )}
        </div>

        <div className="mt-9 overflow-hidden rounded-[14px] bg-ink shadow-[0_30px_60px_-30px_rgba(16,20,28,.4)]">
          <div className="flex gap-1 border-b border-white/8 px-3 pt-3">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-t-md px-4 py-2.5 font-mono text-[13px] transition-colors ${
                  i === active
                    ? "border-b-2 border-elektryk bg-white/6 text-paper"
                    : "border-b-2 border-transparent text-paper/50 hover:text-paper/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="min-h-[260px] overflow-x-auto px-6 py-[22px]">
            {equalHeight ? (
              <div className="grid">
                {tabs.map((t, i) => (
                  <div
                    key={t.label}
                    aria-hidden={i !== activeIndex}
                    className={`col-start-1 row-start-1 ${
                      i === activeIndex ? "" : "invisible"
                    }`}
                  >
                    {renderTab(t)}
                  </div>
                ))}
              </div>
            ) : (
              renderTab(tabs[activeIndex])
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
