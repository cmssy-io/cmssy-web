import Image from "next/image";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import type { heroProps } from "./block";

export default function Hero({ content }: BlockProps<typeof heroProps>) {
  const {
    badgeText,
    heading,
    headingHighlight,
    subheading,
    primaryButtonText,
    primaryButtonUrl = "/signup",
    secondaryButtonText,
    secondaryButtonUrl = "#demo",
    socialProofPrefix,
    socialProofCount,
    socialProofText,
    media,
  } = content;

  // Detect if media is a video (by file extension)
  const isVideo =
    media &&
    (media.endsWith(".mp4") ||
      media.endsWith(".webm") ||
      media.endsWith(".ogg"));

  return (
    <section className="cmssy-hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-background to-purple-50" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-400/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1000ms" }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container className="relative py-16 sm:py-24 lg:py-32 text-center">
        {/* Badge */}
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Main heading */}
        {(heading || headingHighlight) && (
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            {heading}
            {headingHighlight && (
              <>
                <br />
                <span className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              </>
            )}
          </h1>
        )}

        {/* Subheading */}
        {subheading && (
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
            {subheading}
          </p>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-16">
          {primaryButtonText && (
            <CmssyLink href={primaryButtonUrl || "#"}>
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-medium text-white shadow-lg shadow-violet-500/25 transition-colors">
                {primaryButtonText}
                <ArrowRight className="w-5 h-5" />
              </button>
            </CmssyLink>
          )}
          {secondaryButtonText && (
            <CmssyLink
              href={secondaryButtonUrl || "#"}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-medium transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              {secondaryButtonText}
            </CmssyLink>
          )}
        </div>

        {/* Social proof */}
        {(socialProofPrefix || socialProofText) && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {socialProofPrefix}
              {socialProofCount && (
                <>
                  {" "}
                  <span className="font-semibold text-foreground">
                    {socialProofCount}
                  </span>
                </>
              )}{" "}
              {socialProofText}
            </p>
          </div>
        )}

        {/* Hero image/preview */}
        {media && (
          <div className="mt-12 sm:mt-20 relative">
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-xl shadow-2xl shadow-violet-500/10 overflow-hidden bg-background">
              <div className="aspect-video relative overflow-hidden">
                {isVideo ? (
                  <video
                    src={media}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={media}
                    alt={heading}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
