"use client";

import { useState } from "react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "../../../components/container";
import type { docsApiReferenceProps } from "../block";

const METHOD_STYLES: Record<string, string> = {
  query: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  mutation: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  subscription: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  POST: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
};

const AUTH_LABELS: Record<string, { text: string; className: string }> = {
  required: {
    text: "Auth Required",
    className: "text-amber-400 bg-amber-500/10",
  },
  optional: {
    text: "Auth Optional",
    className: "text-sky-400 bg-sky-500/10",
  },
  none: {
    text: "No Auth",
    className: "text-zinc-400 bg-zinc-500/10",
  },
};

function CodeBlock({
  code,
  language,
  label,
}: {
  code: string;
  language: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          onClick={handleCopy}
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

export default function DocsApiReference({
  content,
}: BlockProps<typeof docsApiReferenceProps>) {
  const {
    title,
    description,
    method = "query",
    endpoint,
    auth = "required",
    parameters = [],
    requestExample,
    requestLanguage = "graphql",
    responseExample,
    responseLanguage = "json",
  } = content;

  const methodStyle = METHOD_STYLES[method] ?? METHOD_STYLES.query;
  const authInfo = AUTH_LABELS[auth] ?? AUTH_LABELS.required;

  return (
    <Container as="section" className="py-6">
      {/* Header */}
      <div className="rounded-lg border bg-zinc-950 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase tracking-wider border ${methodStyle}`}
            >
              {method}
            </span>

            {title && (
              <h3 className="text-lg font-semibold font-mono text-zinc-100">
                {title}
              </h3>
            )}

            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${authInfo.className}`}
            >
              {authInfo.text}
            </span>
          </div>

          {endpoint && (
            <code className="mt-2 block text-sm font-mono text-zinc-400">
              {endpoint}
            </code>
          )}

          {description && (
            <div
              className="mt-3 text-sm text-zinc-400 prose prose-sm prose-invert max-w-none prose-code:text-violet-400 prose-code:bg-violet-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        {/* Parameters */}
        {parameters.length > 0 && (
          <div className="border-b border-zinc-800">
            <div className="px-6 py-3 border-b border-zinc-800/50">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                Parameters
              </span>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {parameters.map((param, i) => (
                <div
                  key={i}
                  className="px-6 py-3 flex items-start gap-4 hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2 shrink-0 min-w-[140px]">
                    <code className="text-sm font-mono font-semibold text-violet-400">
                      {param.name}
                    </code>
                    {param.required && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-1 py-0.5 rounded">
                        req
                      </span>
                    )}
                  </div>
                  <code className="text-sm font-mono text-amber-400 shrink-0">
                    {param.type}
                  </code>
                  {param.description && (
                    <span className="text-sm text-zinc-500">
                      {param.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Examples */}
        {(requestExample || responseExample) && (
          <div className="p-6 space-y-4">
            {requestExample && (
              <CodeBlock
                code={requestExample}
                language={requestLanguage}
                label="Request"
              />
            )}
            {responseExample && (
              <CodeBlock
                code={responseExample}
                language={responseLanguage}
                label="Response"
              />
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
