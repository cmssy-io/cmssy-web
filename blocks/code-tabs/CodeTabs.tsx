"use client";

import { Fragment, useState } from "react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { codeTabsProps } from "./block";

const TOKEN =
  /("[^"\n]*")|(\/\/[^\n]*|#[^\n]*)|(\b(?:import|from|export|default|async|function|const|await|return|query)\b)|(<\/?[A-Z][\w.]*|\/>)|(✓)|(^[>] )|((?<=:\s)[A-Z]\w*!?)|([A-Za-z_][\w]*(?=\())/gm;

const TOKEN_COLORS = [
  "#6ee7b7", // string
  "#7f8794", // comment
  "#6ec8f7", // keyword (elektryk-tinted)
  "#5bc6f7", // jsx tag / prompt arrow
  "#6ee7b7", // check mark
  "#5bc6f7", // "> " prompt
  "#6ee7b7", // GraphQL type after colon
  "#f0c674", // function name
];

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of code.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) out.push(code.slice(last, start));
    const groupIndex = match.slice(1).findIndex((g) => g !== undefined);
    out.push(
      <span key={key++} style={{ color: TOKEN_COLORS[groupIndex] }}>
        {match[0]}
      </span>,
    );
    last = start + match[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export default function CodeTabs({
  content,
}: BlockProps<typeof codeTabsProps>) {
  const {
    fig = "FIG 1.0",
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
    return (
      <pre className="m-0 font-mono text-[14px] leading-[1.7] whitespace-pre text-[#e6e8ec]">
        {highlight(code).map((node, i) => (
          <Fragment key={i}>{node}</Fragment>
        ))}
        {showCaret && (
          <span
            className="ml-1 inline-block h-4 w-[9px] translate-y-[3px] bg-elektryk"
            style={{ animation: "hero-blink 1s step-end infinite" }}
          />
        )}
      </pre>
    );
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
