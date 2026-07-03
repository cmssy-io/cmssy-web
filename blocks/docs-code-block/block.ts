import type { ComponentType } from "react";
import type { ShikiTransformer } from "shiki";
import { defineBlock, fields } from "@cmssy/react";
import Component from "./src";

// Languages exposed by the "Language" select. shiki understands all of these
// except "plaintext", which we map to "text".
const SHIKI_LANGS = new Set([
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "bash",
  "json",
  "html",
  "css",
  "markdown",
  "yaml",
  "python",
  "go",
  "rust",
  "sql",
  "graphql",
]);

// Parse highlight lines string (e.g., "1,3-5,8") into a Set of line numbers.
function parseHighlightLines(input?: string): Set<number> {
  const lines = new Set<number>();
  if (!input) return lines;

  for (const part of input.split(",").map((p) => p.trim())) {
    if (!part) continue;
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (Number.isFinite(start) && Number.isFinite(end)) {
        for (let i = start; i <= end; i++) lines.add(i);
      }
    } else {
      const n = Number(part);
      if (Number.isFinite(n)) lines.add(n);
    }
  }
  return lines;
}

export const docsCodeBlockBlock = defineBlock({
  type: "docs-code-block",
  label: "Docs Code Block",
  description: "Syntax-highlighted code snippet; inline within documentation content.",
  // Block components require their own content shape; the registry stores them
  // as accepting arbitrary content (resolved from the CMS at runtime).
  component: Component as unknown as ComponentType<{
    content: Record<string, unknown>;
    data?: { html?: string };
  }>,
  // Server-side syntax highlighting via shiki. Runs during SSR; the resulting
  // HTML is passed to the (client) component as `data.html`. shiki is heavy and
  // async, so it must stay on the server — the component falls back to plain
  // (unhighlighted) code when `data` is absent (e.g. in the editor).
  loader: async ({ content }): Promise<{ html?: string }> => {
    const code = typeof content.code === "string" ? content.code : "";
    if (!code) return { html: "" };

    const language =
      typeof content.language === "string" ? content.language : "text";
    const lang =
      language === "plaintext" || !SHIKI_LANGS.has(language)
        ? "text"
        : language;

    const highlightLines = parseHighlightLines(
      typeof content.highlightLines === "string"
        ? content.highlightLines
        : undefined,
    );

    const transformers: ShikiTransformer[] =
      highlightLines.size > 0
        ? [
            {
              name: "docs-code-block:highlight-lines",
              line(node, line) {
                if (!highlightLines.has(line)) return;
                const existing =
                  typeof node.properties.class === "string"
                    ? node.properties.class
                    : "";
                node.properties.class = existing
                  ? `${existing} highlighted`
                  : "highlighted";
              },
            },
          ]
        : [];

    const { codeToHtml } = await import("shiki");
    try {
      const html = await codeToHtml(code, {
        lang,
        theme: "github-light",
        transformers,
      });
      return { html };
    } catch {
      // Unknown/unsupported language — fall back to plaintext.
      const html = await codeToHtml(code, {
        lang: "text",
        theme: "github-light",
        transformers,
      });
      return { html };
    }
  },
  props: {
    code: fields.multiLine({
      label: "Code",
      placeholder: "// Your code here",
      required: true,
    }),
    language: fields.select({
      label: "Language",
      defaultValue: "typescript",
      options: [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "bash",
        "json",
        "html",
        "css",
        "markdown",
        "yaml",
        "python",
        "go",
        "rust",
        "sql",
        "graphql",
        "plaintext",
      ],
    }),
    filename: fields.singleLine({
      label: "Filename",
      placeholder: "e.g., block.config.ts",
    }),
    showLineNumbers: fields.boolean({
      label: "Show Line Numbers",
      defaultValue: false,
    }),
    highlightLines: fields.singleLine({
      label: "Highlight Lines",
      placeholder: "e.g., 1,3-5,8",
    }),
  },
});
