"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { BlockProps } from "@cmssy/react";
import { CmssyLink } from "@/components/cmssy-locale";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { RESPONSE } from "@/components/motion/presets";
import { HeroChassis } from "./HeroChassis";
import type { heroProps } from "./block";

const WORD_HOLD_MS = 2400;

const WORD_SWAP = { ...RESPONSE, duration: 0.14 };

const FALLBACK_TOOL_CALLS = [
  "add_block_to_page · features",
  "update_block_content · locale de",
  "publish_page · /",
];

function RotatingWord({ words }: { words: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      WORD_HOLD_MS,
    );
    return () => clearInterval(id);
  }, [reduced, words.length]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const current = words[index] ?? "";

  return (
    <span className="relative inline-block align-bottom">
      <span aria-hidden className="invisible whitespace-pre">
        {longest}
      </span>
      <span className="absolute inset-0 whitespace-pre text-elektryk">
        {reduced ? (
          current
        ) : (
          <AnimatePresence initial={false}>
            <m.span
              key={current}
              className="absolute inset-0 whitespace-pre"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={WORD_SWAP}
            >
              {current}
            </m.span>
          </AnimatePresence>
        )}
      </span>
    </span>
  );
}

export default function Hero({ content }: BlockProps<typeof heroProps>) {
  const {
    fig = "",
    eyebrow = "",
    headingPre = "",
    rotatingWords = [],
    headingPost = "",
    headingLine2 = "",
    subheading = "",
    primaryButtonText = "",
    primaryButtonUrl = "",
    secondaryButtonText = "",
    secondaryButtonUrl = "",
    trustLine = "",
    chatPrompt = "",
    chatStatus = "",
    mockupTitle = "",
    mockupBadge = "",
    mockupBadgeDraft = "",
    mockupMeta = "",
    mockupPages = [],
    mockupToolCalls = [],
    mockupDockLabel = "",
    mockupDockTag = "",
    mockupDockSub = "",
    inspectorTitle = "",
    inspectorSubtitle = "",
    inspectorFooter = "",
    codeLine = "",
    codeDataLabel = "",
    plateCaption = "",
    plateCaptionDone = "",
  } = content;

  const words = rotatingWords.map((w) => w.word).filter(Boolean);
  const toolCalls = mockupToolCalls.map((t) => t.call).filter(Boolean);

  return (
    <section className="dot-grid-dark relative overflow-hidden bg-ink pt-section pb-0 xl:pb-section-tight">
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,168,240,.16) 0%, transparent 65%)",
        }}
      />
      <Container>
        <div className="grid items-center gap-14 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <div className="max-w-[52rem]">
            <FigEyebrow fig={fig} label={eyebrow} dark pill />
            <h1 className="mt-6 font-heading text-display font-semibold text-paper xl:text-[clamp(2.25rem,2.9vw,3.25rem)]">
              <span className="block">{headingPre}</span>
              {words.length > 0 ? (
                <span className="block">
                  <RotatingWord words={words} />
                  {headingPost ? <> {headingPost}</> : null}
                </span>
              ) : null}
              {headingLine2 ? (
                <span className="block">{headingLine2}</span>
              ) : null}
            </h1>
            {subheading ? (
              <p className="mt-6 max-w-[58ch] text-lead text-paper/60">
                {subheading}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {primaryButtonText ? (
                <CmssyLink
                  href={primaryButtonUrl || "#"}
                  className="rounded-lg bg-elektryk px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-elektryk/85"
                >
                  {primaryButtonText}
                </CmssyLink>
              ) : null}
              {secondaryButtonText ? (
                <CmssyLink
                  href={secondaryButtonUrl || "#"}
                  className="rounded-lg border border-paper/20 px-6 py-3 text-base font-medium text-paper/85 transition-colors hover:border-paper/40"
                >
                  {secondaryButtonText}
                </CmssyLink>
              ) : null}
            </div>
            {trustLine ? (
              <div className="mt-8 font-mono text-[13px] text-paper/40">
                {trustLine}
              </div>
            ) : null}
          </div>

          <div className="-mb-24 lg:-mb-32 xl:mb-0">
            <HeroChassis
              chatPrompt={chatPrompt}
              chatStatus={chatStatus}
              title={mockupTitle}
              badge={mockupBadge}
              badgeDraft={mockupBadgeDraft || "Draft changes"}
              meta={mockupMeta}
              pages={mockupPages}
              toolCalls={toolCalls.length > 0 ? toolCalls : FALLBACK_TOOL_CALLS}
              dockLabel={mockupDockLabel}
              dockTag={mockupDockTag}
              dockSub={mockupDockSub}
              inspectorTitle={inspectorTitle}
              inspectorSubtitle={inspectorSubtitle}
              inspectorFooter={inspectorFooter}
              codeLine={
                codeLine || "export default createCmssyPage(cmssy, blocks);"
              }
              codeDataLabel={codeDataLabel || "page.blocks[]"}
              caption={plateCaption || "the cmssy editor, editing this page"}
              captionDone={
                plateCaptionDone || "content-only change · no redeploy"
              }
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
