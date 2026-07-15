import type { BlockProps } from "@cmssy/react";
import { Container } from "../../components/container";
import type { demoVideoProps } from "./block";

export default function DemoVideo({ content }: BlockProps<typeof demoVideoProps>) {
  const {
    badgeText,
    heading,
    headingHighlight,
    subheading,
    videoUrl,
    poster,
    autoplay = false,
  } = content;

  return (
    <section className="py-24 bg-slate-50/50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
              {badgeText}
            </div>
          )}
          {(heading || headingHighlight) && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {heading}{" "}
              {headingHighlight && (
                <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {headingHighlight}
                </span>
              )}
            </h2>
          )}
          {subheading && (
            <p className="text-lg text-muted-foreground">{subheading}</p>
          )}
        </div>

        {videoUrl && (
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-linear-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-xl shadow-2xl shadow-violet-500/10 overflow-hidden bg-background ring-1 ring-black/5">
              <div className="aspect-video relative overflow-hidden">
                {autoplay ? (
                  <video
                    src={videoUrl}
                    poster={poster || undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <video
                    src={videoUrl}
                    poster={poster || undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
