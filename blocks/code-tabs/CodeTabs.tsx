"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import type { BlockProps } from "@cmssy/react";
import { CodeSnippet } from "@/components/code-snippet";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { SETTLE } from "@/components/motion/presets";
import { Reveal } from "@/components/motion/reveal";
import { ScrollHint } from "@/components/scroll-hint";
import type { codeTabsProps } from "./block";

const FALLBACK_RESULTS: { label: string; body: string }[] = [
  {
    label: "renders",
    body: `GET /                 200 · static
  hero
  code-tabs
  ai-differentiator
  features
  pricing
  faq
revalidate            ISR + webhook`,
  },
  {
    label: "response",
    body: `"name": "Homepage",
"seoTitle": {
  "en": "Cmssy - The AI-native Headless CMS",
  "pl": "Cmssy - Headless CMS z AI"
},
"publishedBlocks": [ ... ]`,
  },
  {
    label: "result",
    body: `block          features · created
translations   en ✓  de ✓
published      no redeploy`,
  },
];

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
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setHeight(el.getBoundingClientRect().height),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (tabs.length === 0) {
    return (
      <Container className="py-6">
        <div data-block="code-tabs-empty" />
      </Container>
    );
  }

  const activeIndex = Math.min(active, tabs.length - 1);

  const resultFor = (i: number) => {
    const tab = tabs[i];
    const fallback = FALLBACK_RESULTS[i];
    const body = tab.result || fallback?.body;
    if (!body) return null;
    return { label: tab.resultLabel || fallback?.label || "result", body };
  };

  const renderTab = (t: (typeof tabs)[number], i: number) => {
    const code = t.comment ? `${t.comment}\n${t.code}` : t.code;
    const showCaret = t.label?.toUpperCase().includes("MCP");
    const result = resultFor(i);
    return (
      <div className="grid gap-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] @3xl:gap-8">
        <ScrollHint className="-mx-1 px-1">
          <CodeSnippet code={code} caret={showCaret} />
        </ScrollHint>
        {result ? (
          <div className="border-t border-white/8 pt-5 @3xl:border-t-0 @3xl:border-l @3xl:pt-0 @3xl:pl-8">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-paper/35 uppercase">
              <span className="inline-block size-1.5 rounded-[2px] bg-elektryk" />
              {result.label}
            </div>
            <ScrollHint className="mt-3">
              <CodeSnippet
                code={result.body}
                className="text-[12.5px] leading-[1.65] opacity-80"
              />
            </ScrollHint>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section id="code" className="bg-background py-section">
      <Container>
        <div className="max-w-3xl">
          <Reveal>
            <FigEyebrow fig={fig} label={eyebrow} />
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 font-heading text-h2 font-bold text-foreground text-balance">
              {heading}
            </h2>
          </Reveal>
          {description ? (
            <Reveal index={2}>
              <p className="mt-3 max-w-lg text-lead text-muted-foreground">
                {description}
              </p>
            </Reveal>
          ) : null}
        </div>

        <Reveal>
          <div className="@container mt-9 overflow-hidden rounded-[14px] bg-ink shadow-[0_30px_60px_-30px_rgba(16,20,28,.4)]">
            <div
              role="tablist"
              aria-label={heading || "Code examples"}
              className="flex gap-1 overflow-x-auto border-b border-white/8 px-3 pt-3"
            >
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  id={`code-tab-${i}`}
                  aria-controls="code-tabpanel"
                  aria-selected={i === activeIndex}
                  tabIndex={i === activeIndex ? 0 : -1}
                  onKeyDown={(e) => {
                    const d =
                      e.key === "ArrowRight"
                        ? 1
                        : e.key === "ArrowLeft"
                          ? -1
                          : 0;
                    if (!d) return;
                    e.preventDefault();
                    const next = (activeIndex + d + tabs.length) % tabs.length;
                    setActive(next);
                    document.getElementById(`code-tab-${next}`)?.focus();
                  }}
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-t-md px-4 py-2.5 font-mono text-[13px] transition-colors ${
                    i === activeIndex
                      ? "border-b-2 border-elektryk bg-card/6 text-paper"
                      : "border-b-2 border-transparent text-paper/50 hover:text-paper/80"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <m.div
              className="overflow-hidden"
              animate={
                equalHeight && height !== undefined ? { height } : undefined
              }
              initial={false}
              transition={reduced ? { duration: 0 } : SETTLE}
            >
              <div
                ref={panelRef}
                id="code-tabpanel"
                role="tabpanel"
                aria-labelledby={`code-tab-${activeIndex}`}
                className="px-6 py-[22px]"
              >
                {renderTab(tabs[activeIndex], activeIndex)}
              </div>
            </m.div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
