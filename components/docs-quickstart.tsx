"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { CmssyLink } from "./cmssy-locale";
import { ScrollHint } from "./scroll-hint";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { pickRunner, type QuickstartTab } from "@/lib/docs-quickstart";

export function DocsQuickstart({
  tabs,
  copyLabel,
  copiedLabel,
}: {
  tabs: QuickstartTab[];
  copyLabel?: string;
  copiedLabel?: string;
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [runner, setRunner] = useState(tabs[0]?.runners[0] ?? "");
  const [copiedCommand, setCopiedCommand] = useState("");
  const { copied, copy } = useCopyToClipboard();
  const codeRef = useRef<HTMLElement>(null);

  const tab = tabs[Math.min(tabIndex, tabs.length - 1)];
  if (!tab) return null;

  const activeRunner = pickRunner(tab, runner);
  const command = tab.commands[activeRunner] ?? "";
  const firstSpace = command.indexOf(" ");
  const bin = firstSpace === -1 ? command : command.slice(0, firstSpace);
  const rest = firstSpace === -1 ? "" : command.slice(firstSpace);
  const justCopied = copied && copiedCommand === command;
  const bar = "font-mono text-[11px] uppercase tracking-[0.12em]";

  return (
    <div className="overflow-hidden rounded-[14px] border border-paper/8 bg-ink text-paper shadow-[0_30px_60px_-30px_rgba(16,20,28,0.6)]">
      <div className="no-scrollbar flex h-[42px] items-stretch gap-1 overflow-x-auto border-b border-paper/8 bg-ink-deep pl-1.5 pr-2">
        {tabs.length > 1 ? (
          <div role="group" aria-label={tabs.map((entry) => entry.label).join(" / ")} className="flex shrink-0 items-stretch">
            {tabs.map((entry, index) => {
              const active = entry === tab;
              return (
                <button
                  key={index}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTabIndex(index)}
                  className={`${bar} -mb-px border-b-2 px-2 transition-colors duration-[160ms] ${
                    active
                      ? "border-elektryk text-paper"
                      : "border-transparent text-paper/50 hover:text-paper"
                  }`}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>
        ) : (
          <span className={`${bar} self-center px-2 text-paper/50`}>
            {tab.label}
          </span>
        )}
        {tab.runners.length > 1 ? (
          <div role="group" aria-label={tab.runners.join(" / ")} className="ml-auto flex shrink-0 items-stretch">
            {tab.runners.map((entry) => (
              <button
                key={entry}
                type="button"
                aria-pressed={entry === activeRunner}
                onClick={() => setRunner(entry)}
                className={`${bar} -mb-px border-b-2 px-1.5 tracking-[0.06em] transition-colors duration-[160ms] ${
                  entry === activeRunner
                    ? "border-elektryk text-paper"
                    : "border-transparent text-paper/50 hover:text-paper"
                }`}
              >
                {entry}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-3.5 p-4 sm:px-[18px]">
        <ScrollHint className="min-w-0 flex-1">
          <pre className="font-mono text-sm leading-relaxed">
            <code ref={codeRef}>
              <span aria-hidden="true" className="text-paper/55">
                ${" "}
              </span>
              <span className="text-elektryk-300">{bin}</span>
              {rest}
            </code>
          </pre>
        </ScrollHint>
        {copyLabel ? (
          <button
            type="button"
            onClick={async () => {
              setCopiedCommand(command);
              const ok = await copy(command);
              if (!ok && codeRef.current) {
                const range = document.createRange();
                range.selectNodeContents(codeRef.current);
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-elektryk px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink transition-colors duration-[160ms] hover:bg-elektryk-300"
          >
            {justCopied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {justCopied ? copiedLabel || copyLabel : copyLabel}
          </button>
        ) : null}
        <span aria-live="polite" className="sr-only">
          {justCopied ? copiedLabel || copyLabel : ""}
        </span>
      </div>
      {tab.note ? (
        <div className="px-4 pb-3.5 font-mono text-[11px] text-paper/55 sm:px-[18px]">
          {tab.note}
          {tab.noteLabel && tab.noteUrl ? (
            <>
              {" "}
              <CmssyLink
                href={tab.noteUrl}
                className="text-elektryk-300 hover:underline"
              >
                {tab.noteLabel} <span aria-hidden="true">&rarr;</span>
              </CmssyLink>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
