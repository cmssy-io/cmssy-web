import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { BlockProps } from "@cmssy/react";
import type { featuresProps } from "./block";

export default function Features({
  content,
}: BlockProps<typeof featuresProps>) {
  const {
    fig = "FIG 4.0",
    eyebrow = "",
    heading = "",
    headingHighlight = "",
    description = "",
    features = [],
  } = content;

  return (
    <section className="bg-wash py-24">
      <Container>
        <div className="max-w-3xl">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-ink text-balance">
            {heading}
            {headingHighlight && (
              <>
                {" "}
                <span className="text-elektryk-700">{headingHighlight}</span>
              </>
            )}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-ink/60">{description}</p>
          )}
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-ink/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[-.35rem_.35rem_0_rgba(0,168,240,.12)]"
            >
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-ink" />
                <span className="size-2.5 rounded-[3px] bg-ink" />
                <span className="size-2.5 rounded-[3px] bg-elektryk" />
              </div>
              <h3 className="font-heading mt-4 text-lg font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-ink/60">{feature.description}</p>
              {feature.stat && (
                <div className="mt-4 font-mono text-[12px] font-medium text-elektryk-700">
                  {feature.stat}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
