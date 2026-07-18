"use client";

import { useEffect, useState } from "react";
import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { EditorMockup } from "./EditorMockup";
import type { heroProps } from "./block";

export default function Hero({ content }: BlockProps<typeof heroProps>) {
  const {
    fig = "FIG 0.1",
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
    mockupMeta = "",
    mockupPages = [],
    mockupDockLabel = "",
  } = content;

  const words = rotatingWords.map((w) => w.word).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(words[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length < 2) return;
    const word = words[index] ?? "";
    if (!deleting && typed === word) {
      const id = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(id);
    }
    if (deleting && typed === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const id = setTimeout(
      () =>
        setTyped(
          deleting
            ? word.slice(0, typed.length - 1)
            : word.slice(0, typed.length + 1),
        ),
      deleting ? 45 : 85,
    );
    return () => clearTimeout(id);
  }, [words, index, typed, deleting]);

  const display = words.length > 1 ? typed : (words[0] ?? "");

  return (
    <section className="dot-grid-dark relative overflow-hidden bg-ink py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,168,240,.16) 0%, transparent 65%)",
        }}
      />
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.15fr]">
          <div>
            <FigEyebrow fig={fig} label={eyebrow} dark pill />
            <h1 className="font-heading mt-6 text-[clamp(1.75rem,6.5vw,3.4rem)] leading-[1.1] font-semibold tracking-tight text-paper">
              <span className="block">{headingPre}</span>
              <span className="block whitespace-nowrap">
                <span className="whitespace-pre text-elektryk">{display}</span>
                <span
                  className="ml-1 inline-block h-[0.85em] w-[0.42em] translate-y-[0.12em] bg-elektryk"
                  style={{ animation: "hero-blink 1.1s step-end infinite" }}
                />
                {headingPost && <> {headingPost}</>}
              </span>
              {headingLine2 && <span className="block">{headingLine2}</span>}
            </h1>
            {subheading && (
              <p className="mt-5 max-w-xl text-lg text-paper/60">
                {subheading}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {primaryButtonText && (
                <CmssyLink
                  href={primaryButtonUrl || "#"}
                  className="rounded-lg bg-elektryk px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-elektryk/85"
                >
                  {primaryButtonText}
                </CmssyLink>
              )}
              {secondaryButtonText && (
                <CmssyLink
                  href={secondaryButtonUrl || "#"}
                  className="rounded-lg border border-paper/20 px-6 py-3 text-base font-medium text-paper/85 transition-colors hover:border-paper/40"
                >
                  {secondaryButtonText}
                </CmssyLink>
              )}
            </div>
            {trustLine && (
              <div className="mt-8 font-mono text-[13px] text-paper/40">
                {trustLine}
              </div>
            )}
          </div>

          <EditorMockup
            chatPrompt={chatPrompt}
            chatStatus={chatStatus}
            title={mockupTitle}
            badge={mockupBadge}
            meta={mockupMeta}
            pages={mockupPages}
            dockLabel={mockupDockLabel}
          />
        </div>
      </Container>
    </section>
  );
}
