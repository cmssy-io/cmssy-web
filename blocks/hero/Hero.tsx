import type { BlockProps } from "@cmssy/react";
import { CmssyLink } from "@/components/cmssy-locale";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Transport } from "./transport/Transport";
import { buildLabels } from "./transport/labels";
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

  const labels = buildLabels(content);
  const sub = subLines.map((l) => l.line).filter(Boolean);

  return (
    <section className="hero-transport relative overflow-hidden bg-ink">
      <div className="hero-transport__stage">
        <Transport labels={labels} />
      </div>

      <div className="hero-transport__typewrap">
        <Container>
          <div className="hero-transport__type">
            <FigEyebrow fig={fig} label={eyebrow} dark pill />
            <h1 className="mx-auto mt-7 max-w-[15ch] font-heading text-[clamp(2.6rem,5.6vw,4.25rem)] leading-[1.03] font-bold tracking-[-0.035em] text-paper">
              {headlineLead}
              {headlineAccent ? (
                <>
                  {" "}
                  <span className="text-elektryk">{headlineAccent}</span>
                </>
              ) : null}
              {headlineTail ? ` ${headlineTail}` : null}
            </h1>

            {sub.length > 0 ? (
              <p className="mx-auto mt-6 max-w-[42ch] text-[1.05rem] leading-[1.75] text-paper/60">
                {sub.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ) : null}

            <div className="hero-transport__actions mt-8 flex flex-wrap items-center justify-center gap-3.5">
              {primaryButtonText && primaryButtonUrl ? (
                <CmssyLink
                  href={primaryButtonUrl}
                  className="rounded-lg bg-elektryk px-6 py-3 text-[1rem] font-semibold text-ink transition-colors hover:bg-elektryk/85"
                >
                  {primaryButtonText}
                </CmssyLink>
              ) : null}
              {secondaryButtonText && secondaryButtonUrl ? (
                <CmssyLink
                  href={secondaryButtonUrl}
                  className="rounded-lg border border-paper/20 px-6 py-3 text-[1rem] font-medium text-paper/85 transition-colors hover:border-paper/40"
                >
                  {secondaryButtonText}
                </CmssyLink>
              ) : null}
            </div>

            {trustNote ? (
              <div className="mt-5 font-mono text-[12px] text-paper/40">
                {trustNote}
              </div>
            ) : null}
          </div>
        </Container>
      </div>
    </section>
  );
}
