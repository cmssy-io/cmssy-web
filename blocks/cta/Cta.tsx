import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import type { ctaProps } from "./block";

function DockingMark() {
  const fuse = { animation: "cta-fuse 7s linear infinite" };
  return (
    <svg
      viewBox="-40 -40 660 790"
      className="mx-auto h-24 w-auto"
      fill="none"
      aria-hidden="true"
    >
      <rect x="0" y="190" width="360" height="520" rx="90" fill="#FAFAF8" />
      <rect x="0" y="350" width="520" height="360" rx="90" fill="#FAFAF8" />
      <rect x="60" y="410" width="260" height="240" fill="#FAFAF8" />
      <rect
        className="cta-anim"
        x="270"
        y="190"
        width="90"
        height="90"
        fill="#FAFAF8"
        opacity="0"
        style={fuse}
      />
      <rect
        className="cta-anim"
        x="430"
        y="350"
        width="90"
        height="90"
        fill="#FAFAF8"
        opacity="0"
        style={fuse}
      />
      <path
        className="cta-anim"
        d="M360 190 H430 A90 90 0 0 1 520 280 V350 H360 Z"
        fill="#00A8F0"
        opacity="0"
        style={fuse}
      />
      <rect
        className="cta-anim"
        x="420"
        y="0"
        width="160"
        height="160"
        rx="36"
        fill="#00A8F0"
        style={{
          animation: "cta-dock 7s cubic-bezier(0.45, 0, 0.2, 1) infinite",
        }}
      />
    </svg>
  );
}

export default function Cta({ content }: BlockProps<typeof ctaProps>) {
  const {
    badgeText,
    heading,
    headingLine2,
    description,
    primaryButtonText,
    primaryButtonUrl,
    secondaryButtonText,
    secondaryButtonUrl,
  } = content;

  return (
    <section className="dot-grid-dark bg-ink py-24">
      <Container className="max-w-3xl text-center">
        <DockingMark />
        {badgeText && (
          <div className="mt-8 inline-block rounded-full border border-paper/15 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-paper/60 uppercase">
            {badgeText}
          </div>
        )}
        <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-paper text-balance lg:text-5xl">
          {heading}
          {headingLine2 && (
            <>
              {" "}
              <span className="text-elektryk">{headingLine2}</span>
            </>
          )}
        </h2>
        {description && (
          <p className="mx-auto mt-5 max-w-xl text-lg text-paper/60">
            {description}
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          {primaryButtonText && (
            <CmssyLink
              href={primaryButtonUrl || "#"}
              className="rounded-lg bg-elektryk px-7 py-3 text-base font-semibold text-ink transition-colors hover:bg-elektryk/85"
            >
              {primaryButtonText}
            </CmssyLink>
          )}
          {secondaryButtonText && (
            <CmssyLink
              href={secondaryButtonUrl || "#"}
              className="rounded-lg border border-paper/20 px-7 py-3 text-base font-medium text-paper/85 transition-colors hover:border-paper/40"
            >
              {secondaryButtonText}
            </CmssyLink>
          )}
        </div>
      </Container>
    </section>
  );
}
