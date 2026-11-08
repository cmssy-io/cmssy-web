import type { BlockProps } from "@cmssy/react";
import { CmssyLink } from "@/components/cmssy-locale";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { FlowField } from "./flow/FlowField";
import { RunCard } from "./run/RunCard";
import { buildLabels } from "./run/labels";
import type { heroProps } from "./block";

export default function Hero({ content }: BlockProps<typeof heroProps>) {
  const {
    fig = "",
    eyebrow = "",
    headlineLead = "",
    headlineAccent = "",
    headlineTail = "",
    subLines = [],
    primaryButtonText = "",
    primaryButtonUrl = "",
    secondaryButtonText = "",
    secondaryButtonUrl = "",
    trustNote = "",
  } = content;

  const sub = subLines.map((l) => l.line).filter(Boolean);
  const labels = buildLabels(content);

  return (
    <section className="hero-flow relative overflow-hidden bg-ink">
      <FlowField />

      <Container className="relative z-10">
        <div className="hero-flow__grid">
          <div className="hero-flow__copy">
            <FigEyebrow fig={fig} label={eyebrow} dark pill />
            <h1 className="mt-7 font-heading text-display font-bold text-balance text-paper lg:text-[clamp(2.625rem,4.2vw,4.5rem)]">
              <span className="block">{headlineLead}</span>
              {headlineAccent || headlineTail ? (
                <>
                  {" "}
                  <span className="block">
                    {headlineAccent ? (
                      <span className="text-elektryk">{headlineAccent}</span>
                    ) : null}
                    {headlineAccent && headlineTail ? " " : null}
                    {headlineTail}
                  </span>
                </>
              ) : null}
            </h1>

            {sub.length > 0 ? (
              <p className="mt-6 max-w-[40ch] text-lead text-paper/60">
                {sub.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {primaryButtonText && primaryButtonUrl ? (
                <CmssyLink
                  href={primaryButtonUrl}
                  className="rounded-lg bg-elektryk px-6 py-3 text-body font-semibold text-ink transition-colors hover:bg-elektryk/85"
                >
                  {primaryButtonText}
                </CmssyLink>
              ) : null}
              {secondaryButtonText && secondaryButtonUrl ? (
                <CmssyLink
                  href={secondaryButtonUrl}
                  className="rounded-lg border border-paper/20 px-6 py-3 text-body font-medium text-paper/85 transition-colors hover:border-paper/40"
                >
                  {secondaryButtonText}
                </CmssyLink>
              ) : null}
            </div>

            {trustNote ? (
              <div className="mt-5 font-mono text-caption text-paper/40">
                {trustNote}
              </div>
            ) : null}
          </div>

          <div className="hero-flow__aside">
            <RunCard labels={labels} />
          </div>
        </div>
      </Container>
    </section>
  );
}
