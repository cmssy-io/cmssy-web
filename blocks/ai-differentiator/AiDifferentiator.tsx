import { CmssyLink } from "@cmssy/next/client";
import type { BlockProps } from "@cmssy/react";
import { CmssyMark } from "@/components/cmssy-mark";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { aiDifferentiatorProps } from "./block";

export default function AiDifferentiator({
  content,
}: BlockProps<typeof aiDifferentiatorProps>) {
  const {
    fig = "",
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
            <div className="flex items-center gap-2.5 border-b border-paper/10 px-4 py-3 font-mono text-[12px] text-paper/40">
              <CmssyMark className="h-3.5 w-auto text-paper" />
              claude · cmssy mcp
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div className="max-w-[80%] self-end rounded-[12px] rounded-br-[3px] bg-elektryk px-[15px] py-[11px] text-[14px] leading-normal font-medium text-ink">
                {chatUser}
              </div>
              <div className="max-w-[88%] self-start rounded-[12px] rounded-bl-[3px] border border-white/8 bg-[#161b26] px-[15px] py-[13px] text-[14px] leading-snug text-[#d7dae0]">
                {chatReply}
                {chatTools.length > 0 && (
                  <div className="mt-3 flex flex-col gap-[7px] font-mono text-[12px] leading-normal">
                    {chatTools.map((t) => {
                      const [name, ...rest] = t.call.split(" · ");
                      return (
                        <span
                          key={t.call}
                          className="flex items-center gap-2 text-[#9aa1ad]"
                        >
                          <span className="text-[#6ee7b7]">✓</span> {name}
                          {rest.length > 0 && (
                            <span className="opacity-60">
                              · {rest.join(" · ")}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {chatBadge && (
                <div className="inline-flex items-center self-start rounded-lg border border-elektryk/30 bg-elektryk/12 px-3 py-2 font-mono text-[12px] text-elektryk-300">
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
