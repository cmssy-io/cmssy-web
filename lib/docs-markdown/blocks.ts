import { mediaUrl, type MediaLike } from "@cmssy/core";
import { groupQuickstart } from "@/lib/docs-quickstart";
import { htmlToMarkdown, markdownHref } from "./html";

type Content = Record<string, unknown>;
type Renderer = (content: Content, base: string) => string;

function records(value: unknown): Content[] {
  return Array.isArray(value)
    ? value.filter((item): item is Content => Boolean(item) && typeof item === "object")
    : [];
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function join(...parts: string[]): string {
  return parts.filter(Boolean).join("\n\n");
}

function heading(value: string, level: number): string {
  return value ? `${"#".repeat(level)} ${value}` : "";
}

function fenced(code: string, language: string): string {
  const longest = Math.max(2, ...(code.match(/`+/g) ?? []).map((run) => run.length));
  const fence = "`".repeat(longest + 1);
  return `${fence}${language}\n${code}\n${fence}`;
}

function quickstart(rows: unknown, base: string): string[] {
  const tabs = groupQuickstart(
    records(rows).map((row) => ({
      tab: text(row.tab),
      runner: text(row.runner),
      command: text(row.command),
      note: text(row.note),
      noteLabel: text(row.noteLabel),
      noteUrl: text(row.noteUrl),
    })),
  );
  return tabs.map((tab) =>
    join(
      heading(tab.label, 3),
      fenced(
        tab.runners
          .map((runner) =>
            tab.runners.length > 1
              ? `# ${runner}\n${tab.commands[runner]}`
              : tab.commands[runner],
          )
          .join("\n\n"),
        "bash",
      ),
      tab.noteLabel && tab.noteUrl
        ? `${tab.note} [${tab.noteLabel}](${markdownHref(tab.noteUrl, base)})`.trim()
        : tab.note,
    ),
  );
}

function linkList(items: unknown, base: string): string {
  return records(items)
    .filter((item) => text(item.title) && text(item.url))
    .map((item) => {
      const link = `[${text(item.title)}](${markdownHref(text(item.url), base)})`;
      return `- ${link}${text(item.description) ? `: ${text(item.description)}` : ""}`;
    })
    .join("\n");
}

const renderers: Record<string, Renderer> = {
  // The page title is the document heading; the article repeats it.
  "docs-article": (content, base) =>
    join(text(content.description), htmlToMarkdown(text(content.content), base)),

  "docs-callout": (content, base) => {
    const label = text(content.type).toUpperCase() || "NOTE";
    const title = text(content.title);
    const body = htmlToMarkdown(text(content.content), base);
    return `**${label}${title ? `: ${title}` : ""}**\n\n${body}`.replace(/^/gm, "> ");
  },

  "docs-steps": (content, base) =>
    join(
      heading(text(content.heading), 2),
      text(content.description),
      ...records(content.steps).map((step, index) =>
        join(
          heading(`${index + 1}. ${text(step.title)}`, 3),
          htmlToMarkdown(text(step.content), base),
        ),
      ),
    ),

  "docs-hero": (content, base) =>
    join(
      text(content.description),
      ...quickstart(content.commands, base),
      linkList(content.quickLinks, base),
    ),

  "docs-card-grid": (content, base) =>
    join(
      heading(text(content.heading), 2),
      text(content.description),
      linkList(content.cards, base),
    ),

  "docs-tabs": (content, base) =>
    join(
      ...records(content.tabs).map((tab) =>
        join(heading(text(tab.label), 3), htmlToMarkdown(text(tab.content), base)),
      ),
    ),

  "docs-terminal": (content) => {
    const commands = records(content.commands)
      .filter((entry) => text(entry.command))
      .map((entry) =>
        [`${text(entry.prompt) || "$"} ${text(entry.command)}`, text(entry.output)]
          .filter(Boolean)
          .join("\n"),
      );
    return commands.length ? fenced(commands.join("\n"), "bash") : "";
  },

  "docs-image": (content, base) => {
    const url = mediaUrl(content.src as MediaLike)?.trim();
    if (!url) return "";
    return join(
      `![${text(content.alt)}](${markdownHref(url, base)})`,
      text(content.caption),
    );
  },

  "docs-tool-catalogue": (content) =>
    join(
      heading(text(content.title), 2),
      text(content.description),
      records(content.tools)
        .filter((tool) => text(tool.name))
        .sort((a, b) => text(a.name).localeCompare(text(b.name)))
        .map(
          (tool) =>
            `- \`${text(tool.name)}\` (${text(tool.permission) || text(content.noPermissionLabel) || "none"}): ${text(tool.description)}`,
        )
        .join("\n"),
      text(content.note),
    ),
};

/** Navigation and conversion, not documentation. */
const skipped = new Set(["docs-sidebar", "docs-areas", "cta"]);

/**
 * Prose only. The rate limits come from a loader; the others are unused and
 * already removed on main.
 */
const plainText = new Set([
  "docs-rate-limits",
  "docs-api-reference",
  "docs-code-block",
  "docs-feature-list",
  "docs-file-tree",
  "docs-props-table",
]);

/** Every docs block must be listed one way or another; a test holds this. */
export const handledDocsBlocks = new Set([
  ...Object.keys(renderers),
  ...skipped,
  ...plainText,
]);

export function blockToMarkdown(
  type: string,
  content: Content,
  base: string,
  fallback?: (type: string, content: unknown) => string,
): string {
  if (skipped.has(type)) return "";
  return renderers[type]?.(content, base) ?? fallback?.(type, content) ?? "";
}
