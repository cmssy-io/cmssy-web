import type { BlockProps } from "@cmssy/react";
import { CodeSnippet } from "@/components/code-snippet";
import { Reveal } from "@/components/motion/reveal";
import { ScrollHint } from "@/components/scroll-hint";
import { Section } from "@/components/section";
import type { twoAudiencesProps } from "./block";

function EditorWireframe({ caption }: { caption: string }) {
  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-3 font-mono text-[11px] text-muted-foreground">
        <span className="size-2 rounded-full bg-muted" />
        {caption}
      </div>
      <div className="mt-3 space-y-2">
        <div className="rounded-md border-2 border-elektryk/60 bg-elektryk/5 px-3 py-2">
          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>
        <div
          className="h-14 rounded-md border border-border"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(16,20,28,.06) 0 6px, transparent 6px 12px)",
          }}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-md border border-border bg-muted" />
          <div className="h-10 rounded-md border border-border bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function TwoAudiences({
  content,
}: BlockProps<typeof twoAudiencesProps>) {
  const {
    fig = "",
    eyebrow = "",
    heading = "",
    description = "",
    cards = [],
  } = content;

  return (
    <Section
      id="product"
      fig={fig}
      eyebrow={eyebrow}
      heading={heading}
      lead={description}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {cards.map((card, i) => (
          <Reveal
            key={card.title}
            index={i}
            className={`flex min-w-0 flex-col rounded-2xl p-6 sm:p-[30px] ${
              card.dark
                ? "bg-ink text-paper"
                : "border border-border bg-card text-foreground"
            }`}
          >
            <span
              className={`flex items-center gap-2.5 font-mono text-[13px] font-semibold ${
                card.dark ? "text-[#9aa1ad]" : "text-muted-foreground"
              }`}
            >
              <span className="inline-block size-2.5 rounded-[3px] bg-elektryk" />
              {card.kicker}
            </span>
            <h3 className="mt-2 font-heading text-h3 font-semibold">
              {card.title}
            </h3>
            <p
              className={`mt-2.5 text-[15px] leading-relaxed ${
                card.dark ? "text-[#9aa1ad]" : "text-muted-foreground"
              }`}
            >
              {card.description}
            </p>
            {card.code ? (
              <div className="mt-8 overflow-hidden rounded-[11px] border border-white/10 bg-ink-deep lg:mt-auto">
                {card.codeLabel ? (
                  <div className="flex h-[34px] items-center border-b border-white/8 px-3 font-mono text-[11px] font-medium text-[#9aa1ad]">
                    {card.codeLabel}
                  </div>
                ) : null}
                <ScrollHint className="p-4">
                  <CodeSnippet
                    code={card.code}
                    className="text-[12.5px] leading-[1.7]"
                  />
                </ScrollHint>
              </div>
            ) : (
              <EditorWireframe caption={card.wireframeCaption ?? ""} />
            )}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
