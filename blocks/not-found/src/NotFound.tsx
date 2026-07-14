import type { BlockProps } from "@cmssy/react";
import { ArrowRight, Home } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import { Container } from "../../../components/container";
import type { notFoundProps } from "../block";

export default function NotFound({
  content,
}: BlockProps<typeof notFoundProps>) {
  const {
    heading,
    title,
    description,
    primaryButtonText,
    primaryButtonUrl = "/",
    secondaryButtonText,
    secondaryButtonUrl = "/contact",
  } = content;

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* ── Background: dark gradient wash ── */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-violet-950/5 to-background" />

      {/* ── Radar ping rings ── */}
      <div className="nf-radar-ring" />
      <div className="nf-radar-ring" style={{ animationDelay: "1s" }} />
      <div className="nf-radar-ring" style={{ animationDelay: "2s" }} />
      <div className="nf-radar-ring" style={{ animationDelay: "3s" }} />

      {/* ── Floating geometric shards ── */}
      <div
        className="absolute left-[12%] top-[20%] h-16 w-16 rounded-2xl border border-violet-500/10 bg-violet-500/5 backdrop-blur-sm"
        style={{ animation: "nf-drift 6s ease-in-out infinite" }}
      />
      <div
        className="absolute right-[15%] top-[30%] h-10 w-10 rotate-12 rounded-lg border border-purple-500/10 bg-purple-500/5 backdrop-blur-sm"
        style={{
          animation: "nf-drift-reverse 7s ease-in-out infinite",
          animationDelay: "500ms",
        }}
      />
      <div
        className="absolute bottom-[25%] left-[20%] h-12 w-12 -rotate-6 rounded-xl border border-violet-500/10 bg-violet-500/5 backdrop-blur-sm"
        style={{
          animation: "nf-drift 8s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      />
      <div
        className="absolute bottom-[20%] right-[10%] h-20 w-20 rotate-45 rounded-2xl border border-purple-500/10 bg-purple-500/5 backdrop-blur-sm"
        style={{
          animation: "nf-drift-reverse 9s ease-in-out infinite",
          animationDelay: "800ms",
        }}
      />
      <div
        className="absolute right-[35%] top-[15%] h-6 w-6 rounded-full border border-violet-400/15 bg-violet-400/5"
        style={{
          animation: "nf-drift 5s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />

      {/* ── Scanline overlay ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.015]">
        <div
          className="h-full w-full bg-linear-to-b from-transparent via-foreground to-transparent"
          style={{ animation: "nf-scanline 8s linear infinite" }}
        />
      </div>

      {/* ── Content ── */}
      <Container className="relative z-10 py-20 text-center sm:py-28">
        {/* Giant glitching number */}
        {heading && (
          <div className="mb-4 select-none sm:mb-6" aria-hidden="true">
            <span
              className="nf-glitch-text inline-block bg-linear-to-r from-violet-600 via-purple-500 to-violet-600 bg-clip-text text-[8rem] leading-none font-black tracking-tighter text-transparent sm:text-[12rem] lg:text-[16rem]"
              data-text={heading}
            >
              {heading}
            </span>
          </div>
        )}

        {/* Decorative crosshair divider */}
        <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10">
          <div className="h-px w-12 bg-linear-to-r from-transparent to-violet-500/40 sm:w-20" />
          <div className="relative h-3 w-3">
            <div className="absolute inset-0 rounded-full bg-violet-500/60" />
            <div className="absolute -inset-1 animate-ping rounded-full bg-violet-500/20" />
          </div>
          <div className="h-px w-12 bg-linear-to-l from-transparent to-violet-500/40 sm:w-20" />
        </div>

        {/* Title */}
        {title && (
          <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {title}
          </h1>
        )}

        {/* Description */}
        {description && (
          <p className="mx-auto mb-10 max-w-lg text-base text-muted-foreground sm:mb-12 sm:text-lg">
            {description}
          </p>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {primaryButtonText && (
            <CmssyLink
              href={primaryButtonUrl || "/"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-violet-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-700 hover:to-purple-700 hover:shadow-violet-500/30 sm:px-8 sm:py-3.5 sm:text-lg"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              {primaryButtonText}
            </CmssyLink>
          )}
          {secondaryButtonText && (
            <CmssyLink
              href={secondaryButtonUrl || "#"}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:px-8 sm:py-3.5 sm:text-lg"
            >
              {secondaryButtonText}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </CmssyLink>
          )}
        </div>
      </Container>
    </section>
  );
}
