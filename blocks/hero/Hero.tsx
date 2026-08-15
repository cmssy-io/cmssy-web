import type { BlockProps } from "@cmssy/react";
import { CmssyLink } from "@/components/cmssy-locale";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import { Transport } from "./transport/Transport";
import { buildLabels } from "./transport/labels";
import type { heroProps } from "./block";

/* Stored blocks keep whatever fields they were saved with, so schema defaults
   do not backfill an existing page. Every value the hero needs to read
   correctly is therefore also defaulted here. */
const FALLBACK = {
  fig: "FIG 0.1",
  eyebrow: "AI-NATIVE HEADLESS CMS",
  lead: "Change the page.",
  accent: "Deploy",
  tail: "nothing.",
  trust: "@cmssy/next · 80+ MCP tools · No card needed",
  primary: "Try it free →",
  primaryUrl: "https://cmssy.io/login",
  secondary: "See how it works",
  secondaryUrl: "#code",
};

const FALLBACK_SUB = [
  "Claude edits structured content through MCP.",
  "One page carries all five locales.",
  "Your Next.js app revalidates in place.",
];

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
  const authored = subLines.map((l) => l.line).filter(Boolean);
  const sub = authored.length > 0 ? authored : FALLBACK_SUB;

  const lead = headlineLead || FALLBACK.lead;
  const accent = headlineAccent || FALLBACK.accent;
  const tail = headlineTail || FALLBACK.tail;
  const trust = trustNote || FALLBACK.trust;
  const primary = primaryButtonText || FALLBACK.primary;
  const secondary = secondaryButtonText || FALLBACK.secondary;

  return (
    <section className="hero-transport relative overflow-hidden bg-ink">
      <div className="hero-transport__stage">
        <Transport labels={labels} />
      </div>

      <div className="hero-transport__typewrap">
        <Container>
          <div className="hero-transport__type">
            <FigEyebrow
              fig={fig || FALLBACK.fig}
              label={eyebrow || FALLBACK.eyebrow}
              dark
              pill
            />
            <h1 className="mx-auto mt-7 max-w-[15ch] font-heading text-[clamp(2.6rem,5.6vw,4.25rem)] leading-[1.03] font-bold tracking-[-0.035em] text-paper">
              {lead}
              {accent ? (
                <>
                  {" "}
                  <span className="text-elektryk">{accent}</span>
                </>
              ) : null}
              {tail ? ` ${tail}` : null}
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

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              {primary ? (
                <CmssyLink
                  href={primaryButtonUrl || FALLBACK.primaryUrl}
                  className="rounded-lg bg-elektryk px-6 py-3 text-[1rem] font-semibold text-ink transition-colors hover:bg-elektryk/85"
                >
                  {primary}
                </CmssyLink>
              ) : null}
              {secondary ? (
                <CmssyLink
                  href={secondaryButtonUrl || FALLBACK.secondaryUrl}
                  className="rounded-lg border border-paper/20 px-6 py-3 text-[1rem] font-medium text-paper/85 transition-colors hover:border-paper/40"
                >
                  {secondary}
                </CmssyLink>
              ) : null}
            </div>

            {trust ? (
              <div className="mt-5 font-mono text-[12px] text-paper/40">
                {trust}
              </div>
            ) : null}
          </div>
        </Container>
      </div>
    </section>
  );
}
