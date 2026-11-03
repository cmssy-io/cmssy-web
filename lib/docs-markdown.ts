// Docs pages as Markdown, for AI agents and for "Copy page".
//
// Derived from the published blocks on every read, so there is no second copy
// of the docs to keep in step. No markup parser on purpose: the CMS rich text
// is a small, well-formed tag set, and this also runs in the route handler.

export type MarkdownBlock = { type: string; content?: unknown };

export type MarkdownPage = {
  title: string;
  description?: string;
  url: string;
  lastUpdated?: string;
  blocks: MarkdownBlock[];
};

export type MarkdownOptions = {
  /** Public origin; site-relative links become absolute against it. */
  base: string;
  locale: string;
  fallbackLocale: string;
  /** Plain text for a block type nothing below knows. */
  fallback?: (type: string, content: unknown) => string;
};

type HtmlNode =
  | { kind: "text"; value: string }
  | { kind: "element"; tag: string; attrs: Record<string, string>; children: HtmlNode[] };

const VOID_TAGS = new Set(["br", "hr", "img", "input", "wbr"]);
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  return value.replace(
    /&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi,
    (whole, dec, hex, name) => {
      if (dec) return String.fromCodePoint(Number(dec));
      if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
      return ENTITIES[String(name).toLowerCase()] ?? whole;
    },
  );
}

function parseHtml(html: string): HtmlNode[] {
  const root: HtmlNode[] = [];
  const stack: Extract<HtmlNode, { kind: "element" }>[] = [];
  const tag = /<!--[\s\S]*?-->|<\/?([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
  const append = (node: HtmlNode) =>
    (stack[stack.length - 1]?.children ?? root).push(node);

  let cursor = 0;
  for (const match of html.matchAll(tag)) {
    if (match.index > cursor) {
      append({ kind: "text", value: decodeEntities(html.slice(cursor, match.index)) });
    }
    cursor = match.index + match[0].length;
    const name = match[1]?.toLowerCase();
    if (!name) continue;

    if (match[0].startsWith("</")) {
      const open = stack.map((el) => el.tag).lastIndexOf(name);
      if (open !== -1) stack.length = open;
      continue;
    }

    const attrs: Record<string, string> = {};
    for (const attr of (match[2] ?? "").matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      attrs[String(attr[1]).toLowerCase()] = decodeEntities(attr[2] ?? attr[3] ?? "");
    }
    const element: HtmlNode = { kind: "element", tag: name, attrs, children: [] };
    append(element);
    if (!VOID_TAGS.has(name) && !match[0].endsWith("/>")) stack.push(element);
  }
  if (cursor < html.length) {
    append({ kind: "text", value: decodeEntities(html.slice(cursor)) });
  }
  return root;
}

function textOf(nodes: HtmlNode[]): string {
  return nodes
    .map((node) => (node.kind === "text" ? node.value : textOf(node.children)))
    .join("");
}

/** Site-relative becomes absolute; a docs page points at its Markdown twin. */
export function markdownHref(href: string, base: string): string {
  if (!href.startsWith("/")) return href;
  const [path = "", suffix] = href.split(/(?=[?#])/, 2);
  const isDocs = path === "/docs" || path.startsWith("/docs/");
  return `${base}${path}${isDocs ? ".md" : ""}${suffix ?? ""}`;
}

/** Inline code that may itself hold backticks. */
function inlineCode(value: string): string {
  const longest = Math.max(0, ...(value.match(/`+/g) ?? []).map((run) => run.length));
  const fence = "`".repeat(longest + 1);
  const pad = value.startsWith("`") || value.endsWith("`") ? " " : "";
  return `${fence}${pad}${value}${pad}${fence}`;
}

function fencedCode(code: string, language = ""): string {
  const trimmed = code.replace(/^\n+|\s+$/g, "");
  const longest = Math.max(2, ...(trimmed.match(/`+/g) ?? []).map((run) => run.length));
  const fence = "`".repeat(longest + 1);
  return `${fence}${language}\n${trimmed}\n${fence}`;
}

function inline(nodes: HtmlNode[], base: string): string {
  return nodes
    .map((node) => {
      if (node.kind === "text") return node.value.replace(/\s+/g, " ");
      const body = () => inline(node.children, base);
      switch (node.tag) {
        case "strong":
        case "b":
          return `**${body().trim()}**`;
        case "em":
        case "i":
          return `*${body().trim()}*`;
        case "code":
          return inlineCode(textOf(node.children));
        case "a":
          return node.attrs.href
            ? `[${body().trim()}](${markdownHref(node.attrs.href, base)})`
            : body();
        case "br":
          return "  \n";
        case "img":
          return node.attrs.src
            ? `![${node.attrs.alt ?? ""}](${markdownHref(node.attrs.src, base)})`
            : "";
        default:
          return body();
      }
    })
    .join("");
}

function tableCell(node: HtmlNode, base: string): string {
  if (node.kind === "text") return node.value.trim();
  return inline(node.children, base).trim().replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");
}

function elementsOf(nodes: HtmlNode[], tags: string[]) {
  const found: Extract<HtmlNode, { kind: "element" }>[] = [];
  for (const node of nodes) {
    if (node.kind !== "element") continue;
    if (tags.includes(node.tag)) found.push(node);
    else found.push(...elementsOf(node.children, tags));
  }
  return found;
}

function table(nodes: HtmlNode[], base: string): string {
  const rows = elementsOf(nodes, ["tr"]).map((row) =>
    elementsOf(row.children, ["th", "td"]).map((cell) => tableCell(cell, base)),
  );
  const [head, ...rest] = rows;
  if (!head) return "";
  return [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rest.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

const BLOCK_TAGS = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "pre", "table",
  "blockquote", "hr", "div", "section",
]);

function isBlock(node: HtmlNode): boolean {
  return node.kind === "element" && BLOCK_TAGS.has(node.tag);
}

function list(
  node: Extract<HtmlNode, { kind: "element" }>,
  base: string,
): string {
  const ordered = node.tag === "ol";
  return node.children
    .filter((child) => child.kind === "element" && child.tag === "li")
    .map((item, index) => {
      const marker = ordered ? `${index + 1}. ` : "- ";
      const body = blocks(item.kind === "element" ? item.children : [], base);
      const indent = " ".repeat(marker.length);
      return marker + body.split("\n").join(`\n${indent}`).replace(/\n\s*\n(\s*)(?=[-\d])/g, "\n$1");
    })
    .join("\n");
}

function blocks(nodes: HtmlNode[], base: string): string {
  const out: string[] = [];
  let run: HtmlNode[] = [];
  const flush = () => {
    const text = inline(run, base).trim();
    if (text) out.push(text);
    run = [];
  };

  for (const node of nodes) {
    if (node.kind !== "element" || !isBlock(node)) {
      run.push(node);
      continue;
    }
    flush();
    if (/^h[1-6]$/.test(node.tag)) {
      out.push(`${"#".repeat(Number(node.tag[1]))} ${inline(node.children, base).trim()}`);
    } else if (node.tag === "ul" || node.tag === "ol") {
      out.push(list(node, base));
    } else if (node.tag === "pre") {
      const code = elementsOf(node.children, ["code"])[0];
      const language = code?.attrs.class?.match(/language-([\w-]+)/)?.[1];
      out.push(fencedCode(textOf(node.children), language));
    } else if (node.tag === "table") {
      out.push(table(node.children, base));
    } else if (node.tag === "blockquote") {
      out.push(blocks(node.children, base).replace(/^/gm, "> "));
    } else if (node.tag === "hr") {
      out.push("---");
    } else {
      out.push(blocks(node.children, base));
    }
  }
  flush();
  return out.filter(Boolean).join("\n\n");
}

export function htmlToMarkdown(html: string, base = ""): string {
  return blocks(parseHtml(html), base);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** A title may be followed by plain copy or rich text; either way it is markup-safe. */
function rich(value: unknown, base: string): string {
  return htmlToMarkdown(str(value), base);
}

function section(heading: string, level: number, parts: string[]): string {
  return [heading ? `${"#".repeat(level)} ${heading}` : "", ...parts]
    .filter(Boolean)
    .join("\n\n");
}

function linkList(items: Record<string, unknown>[], base: string): string {
  return items
    .filter((item) => str(item.title) && str(item.url))
    .map((item) => `- [${str(item.title)}](${markdownHref(str(item.url), base)})`)
    .join("\n");
}

/** Blocks that are navigation or conversion, not documentation. */
const SKIPPED_BLOCKS = new Set(["docs-sidebar", "cta"]);

function blockToMarkdown(block: MarkdownBlock, options: MarkdownOptions): string {
  const { base, locale, fallbackLocale, fallback } = options;
  const buckets = asRecord(block.content);
  const content = asRecord(buckets[locale] ?? buckets[fallbackLocale]);

  switch (block.type) {
    case "docs-article":
      // The page title is the document heading; the article repeats it.
      return section("", 2, [
        str(content.description),
        rich(content.content, base),
      ]);
    case "docs-callout": {
      const label = str(content.type).toUpperCase() || "NOTE";
      const title = str(content.title);
      const body = rich(content.content, base);
      return `**${label}${title ? `: ${title}` : ""}**\n\n${body}`.replace(/^/gm, "> ");
    }
    case "docs-steps":
      return section(str(content.heading), 2, [
        str(content.description),
        ...asRecords(content.steps).map((step, index) =>
          section(`${index + 1}. ${str(step.title)}`, 3, [rich(step.content, base)]),
        ),
      ]);
    case "docs-hero":
      return section("", 2, [linkList(asRecords(content.quickLinks), base)]);
    case "docs-card-grid":
      return section(str(content.heading), 2, [linkList(asRecords(content.cards), base)]);
    case "docs-tabs":
      return asRecords(content.tabs)
        .map((tab) => section(str(tab.label), 3, [rich(tab.content, base)]))
        .join("\n\n");
    case "docs-terminal":
      return fencedCode(
        asRecords(content.commands)
          .map((entry) =>
            [`${str(entry.prompt) || "$"} ${str(entry.command)}`, str(entry.output)]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n"),
        "bash",
      );
    case "docs-image": {
      const src = asRecord(content.src).url;
      const url = str(typeof content.src === "string" ? content.src : src);
      if (!url) return "";
      const image = `![${str(content.alt)}](${markdownHref(url, base)})`;
      return str(content.caption) ? `${image}\n\n${str(content.caption)}` : image;
    }
    case "docs-tool-catalogue": {
      const tools = asRecords(content.tools)
        .filter((tool) => str(tool.name))
        .sort((a, b) => str(a.name).localeCompare(str(b.name)));
      const none = str(content.noPermissionLabel) || "none";
      return section(str(content.title), 2, [
        str(content.description),
        tools
          .map(
            (tool) =>
              `- \`${str(tool.name)}\` (${str(tool.permission) || none}): ${str(tool.description)}`,
          )
          .join("\n"),
        str(content.note),
      ]);
    }
    default:
      if (SKIPPED_BLOCKS.has(block.type)) return "";
      return fallback?.(block.type, content) ?? "";
  }
}

export function pageToMarkdown(page: MarkdownPage, options: MarkdownOptions): string {
  const front = [
    "---",
    `title: ${JSON.stringify(page.title)}`,
    ...(page.description ? [`description: ${JSON.stringify(page.description)}`] : []),
    `url: ${page.url}`,
    ...(page.lastUpdated ? [`last_updated: ${page.lastUpdated}`] : []),
    "---",
  ].join("\n");

  const body = page.blocks
    .map((block) => blockToMarkdown(block, options).trim())
    .filter(Boolean)
    .join("\n\n");

  return `${front}\n\n# ${page.title}\n\n${body}\n`;
}

/** Route params to a slug; a rewrite may hand the whole path over as one segment. */
export function docsSlugFromParams(path: string[] | undefined): string {
  const segments = (path ?? [])
    .flatMap((segment) => decodeURIComponent(segment).split("/"))
    .filter(Boolean);
  return ["/docs", ...segments].join("/");
}
