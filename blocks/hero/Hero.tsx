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
    subheading = "",
    primaryButtonText = "",
    primaryButtonUrl = "",
    secondaryButtonText = "",
    secondaryButtonUrl = "",
    trustLine = "",
    chatPrompt = "",
    chatStatus = "",
  } = content;

  const words = rotatingWords.map((w) => w.word).filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      2200,
    );
    return () => clearInterval(id);
  }, [words.length]);

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
            <FigEyebrow fig={fig} label={eyebrow} dark />
            <h1 className="font-heading mt-6 text-5xl font-semibold tracking-tight text-paper text-balance lg:text-[3.4rem] lg:leading-[1.08]">
              {headingPre}{" "}
              <span className="text-elektryk">
                {words[index] ?? words[0] ?? ""}
                <span
                  className="ml-1 inline-block h-[0.85em] w-[0.42em] translate-y-[0.1em] bg-elektryk align-baseline"
                  style={{ animation: "hero-blink 1.1s step-end infinite" }}
                />
              </span>{" "}
              {headingPost}
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
                  className="rounded-lg bg-elektryk px-6 py-3 text-base font-medium text-white transition-colors hover:bg-elektryk/85"
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

          <EditorMockup chatPrompt={chatPrompt} chatStatus={chatStatus} />
        </div>
      </Container>
    </section>
  );
}
