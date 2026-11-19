import type { BlockProps } from "@cmssy/react";
import { CmssyLink } from "@/components/cmssy-locale";
import { Container } from "@/components/container";
import { FlowField } from "./flow/FlowField";
import { HeroScene } from "./scene/HeroScene";
import { buildSceneLabels } from "./scene/types";
import type { heroProps } from "./block";

export default function Hero({ content }: BlockProps<typeof heroProps>) {
  const {
    headlineLead = "",
    headlineAccent = "",
    headlineTail = "",
    subheading = "",
    primaryButtonText = "",
    primaryButtonUrl = "",
    secondaryButtonText = "",
    secondaryButtonUrl = "",
    trustNote = "",
    showScene = true,
  } = content;

  return (
    <section className="hero-flow relative overflow-hidden bg-ink">
      <FlowField />

      <Container className="relative z-10">
        <div className="hero-flow__copy">
          <h1 className="font-heading text-display font-bold text-balance text-paper lg:text-[clamp(2.75rem,4.6vw,4.75rem)]">
            {headlineLead}
            {headlineAccent || headlineTail ? " " : null}
            {headlineAccent ? (
              <span className="text-elektryk">{headlineAccent}</span>
            ) : null}
            {headlineAccent && headlineTail ? " " : null}
            {headlineTail}
          </h1>

          {subheading ? (
            <p className="mx-auto mt-5 max-w-[46ch] text-lead text-paper/60">
              {subheading}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
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
            <div className="mt-5 font-mono text-caption text-paper/50">
              {trustNote}
            </div>
          ) : null}
        </div>

        {showScene ? <HeroScene labels={buildSceneLabels(content)} /> : null}
      </Container>
    </section>
  );
}
