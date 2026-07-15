"use client";

import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";

export function CodeBlock({
  code,
  language,
  label,
}: {
  code: string;
  language: string;
  label: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">{label}</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
            {language}
          </span>
        </div>
        <button
          onClick={() => copy(code)}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}
