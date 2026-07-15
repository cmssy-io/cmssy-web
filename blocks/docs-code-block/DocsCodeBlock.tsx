"use client";

import { Copy, Check, FileCode } from "lucide-react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import type { docsCodeBlockProps } from "./block";
import "./index.css";

type DocsCodeBlockData = {
  /** Pre-highlighted markup produced server-side by shiki (see block.ts loader). */
  html?: string;
};

export default function DocsCodeBlock({
  content,
  data,
}: BlockProps<typeof docsCodeBlockProps, DocsCodeBlockData>) {
  const {
    code = "",
    language = "typescript",
    filename,
    showLineNumbers = false,
  } = content;

  const { copied, copy } = useCopyToClipboard();

  const highlighted = data?.html;

  return (
    <Container className="py-6">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {filename ? (
              <>
                <FileCode className="h-4 w-4" />
                <span>{filename}</span>
              </>
            ) : (
              <span className="text-xs uppercase tracking-wider">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={() => copy(code)}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code */}
        {highlighted ? (
          <div
            className={`docs-code-block-shiki${
              showLineNumbers ? " with-line-numbers" : ""
            }`}
            // shiki output: trusted server-generated markup (escaped tokens +
            // inline styles), not user HTML — safe to inject.
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        ) : (
          // Fallback for contexts where the server loader didn't run (e.g. the
          // editor): plain, escaped code with optional line numbers.
          <div className="overflow-x-auto">
            <pre className="p-4 text-sm leading-relaxed">
              <code>
                {code.split("\n").map((line, index) => (
                  <div key={index} className="flex">
                    {showLineNumbers && (
                      <span className="w-8 shrink-0 select-none pr-4 text-right text-muted-foreground/60">
                        {index + 1}
                      </span>
                    )}
                    <span>{line || " "}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </div>
    </Container>
  );
}
