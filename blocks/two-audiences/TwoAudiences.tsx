import type { BlockProps } from "@cmssy/react";
import { CodeSnippet } from "@/components/code-snippet";
import { Container } from "@/components/container";
import { FigEyebrow } from "@/components/fig-eyebrow";
import type { twoAudiencesProps } from "./block";

function EditorWireframe({ caption }: { caption: string }) {
  return (
    <div className="mt-8 rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-ink/8 pb-3 font-mono text-[11px] text-ink/40">
        <span className="size-2 rounded-full bg-ink/15" />
        {caption}
      </div>
      <div className="mt-3 space-y-2">
        <div className="rounded-md border-2 border-elektryk/60 bg-elektryk/5 px-3 py-2">
          <div className="h-3 w-2/3 rounded bg-ink/15" />
        </div>
        <div
          className="h-14 rounded-md border border-ink/10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(16,20,28,.06) 0 6px, transparent 6px 12px)",
          }}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-md border border-ink/10 bg-ink/3" />
          <div className="h-10 rounded-md border border-ink/10 bg-ink/3" />
        </div>
      </div>
    </div>
  );
}

export default function TwoAudiences({
  content,
}: BlockProps<typeof twoAudiencesProps>) {
  const {
    fig = "FIG 3.0",
    eyebrow = "",
    heading = "",
    description = "",
    cards = [],
  } = content;

  return (
    <section id="product" className="bg-paper py-24">
      <Container>
        <div className="max-w-3xl">
          <FigEyebrow fig={fig} label={eyebrow} />
          <h2 className="font-heading mt-5 text-4xl font-semibold tracking-tight text-ink text-balance">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-ink/60">{description}</p>
          )}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`flex flex-col rounded-2xl p-[30px] ${
                card.dark
                  ? "bg-ink text-paper"
                  : "border border-ink/10 bg-white text-ink"
              }`}
            >
              <span
                className={`flex items-center gap-2.5 font-mono text-[13px] font-semibold ${
                  card.dark ? "text-[#9aa1ad]" : "text-ink/55"
                }`}
              >
                <span className="inline-block size-2.5 rounded-[3px] bg-elektryk" />
                {card.kicker}
              </span>
              <h3 className="font-heading mt-2 text-2xl font-semibold tracking-tight">
                {card.title}
              </h3>
              <p
                className={`mt-2.5 text-[15px] leading-relaxed ${
                  card.dark ? "text-[#9aa1ad]" : "text-ink/60"
                }`}
              >
                {card.description}
              </p>
              {card.code ? (
                <div className="mt-auto overflow-hidden rounded-[11px] border border-white/10 bg-ink-deep pt-0">
                  <div className="flex h-[34px] items-center border-b border-white/8 px-3 font-mono text-[11px] font-medium text-[#9aa1ad]">
                    {card.codeLabel ?? ""}
                  </div>
                  <div className="overflow-x-auto p-4">
                    <CodeSnippet
                      code={card.code}
                      className="text-[12.5px] leading-[1.7]"
                    />
                  </div>
                </div>
              ) : (
                <EditorWireframe caption={card.wireframeCaption ?? ""} />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
