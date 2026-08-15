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
  lead: "This is what one content",
  accent: "change",
  tail: "does.",
  trust: "@cmssy/next · 80+ MCP tools · No card needed",
  primary: "Try it free →",
  primaryUrl: "https://cmssy.io/login",
  secondary: "See how it works",
  secondaryUrl: "#code",
};

const FALLBACK_SUB = [
  "Claude writes one field through MCP.",
  "cmssy keys it to five locales and publishes.",
  "Your Next.js app revalidates.",
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
          <h1 className="mt-6 max-w-[13ch] font-heading text-[clamp(2.35rem,4.75vw,3.5rem)] leading-[1.04] font-bold tracking-[-0.035em] text-paper">
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
            <p className="mt-5 max-w-[36ch] text-[0.94rem] leading-[1.7] text-paper/55">
              {sub.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            {primary ? (
              <CmssyLink
                href={primaryButtonUrl || FALLBACK.primaryUrl}
                className="rounded-lg bg-elektryk px-5 py-2.5 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-elektryk/85"
              >
                {primary}
              </CmssyLink>
            ) : null}
            {secondary ? (
              <CmssyLink
                href={secondaryButtonUrl || FALLBACK.secondaryUrl}
                className="rounded-lg border border-paper/20 px-5 py-2.5 text-[0.95rem] font-medium text-paper/85 transition-colors hover:border-paper/40"
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
