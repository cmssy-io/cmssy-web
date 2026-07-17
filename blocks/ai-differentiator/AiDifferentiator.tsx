import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { aiDifferentiatorProps } from "./block";

export default function AiDifferentiator({
  content,
}: BlockProps<typeof aiDifferentiatorProps>) {
  const {
    fig = "FIG 2.0",
    eyebrow = "",
    heading = "",
    description = "",
    bullets = [],
    linkLabel = "",
    linkUrl = "",
    chatUser = "",
    chatReply = "",
    chatTools = [],
    chatBadge = "",
  } = content;

  return (
    <section className="dot-grid-dark bg-ink py-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <FigEyebrow fig={fig} label={eyebrow} dark />
            <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-paper text-balance">
              {heading}
            </h2>
            {description && (
              <p className="mt-4 text-lg text-paper/60">{description}</p>
            )}
            <ul className="mt-8 space-y-4">
              {bullets.map((b, i) => (
                <li key={b.strong} className="flex gap-3 text-paper/80">
                  <span
                    className={`mt-2 inline-block size-2.5 shrink-0 rounded-[3px] ${
                      i === 0 ? "bg-elektryk" : "bg-paper/25"
                    }`}
                  />
                  <span>
                    <strong className="font-semibold text-paper">
                      {b.strong}
                    </strong>{" "}
                    {b.rest}
                  </span>
                </li>
              ))}
            </ul>
            {linkLabel && (
              <CmssyLink
                href={linkUrl || "#"}
                className="mt-8 inline-block font-medium text-elektryk hover:underline"
              >
                {linkLabel}
              </CmssyLink>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-paper/10 bg-ink-deep shadow-2xl">
            <div className="border-b border-paper/10 px-4 py-3 font-mono text-[12px] text-paper/40">
              claude · cmssy mcp
            </div>
            <div className="space-y-4 p-5">
              <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-elektryk px-4 py-3 text-[14px] text-white">
                {chatUser}
              </div>
              <div className="max-w-[85%] rounded-xl rounded-bl-sm border border-paper/10 bg-ink px-4 py-3 text-[14px] text-paper/85">
                {chatReply}
              </div>
              {chatTools.length > 0 && (
                <div className="space-y-1.5 rounded-lg border border-paper/8 bg-ink px-4 py-3">
                  {chatTools.map((t) => (
                    <div
                      key={t.call}
                      className="font-mono text-[12px] text-emerald-400"
                    >
                      ✓ {t.call}
                    </div>
                  ))}
                </div>
              )}
              {chatBadge && (
                <div className="inline-block rounded-full border border-paper/15 px-3 py-1 font-mono text-[11px] text-paper/50">
                  {chatBadge}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
