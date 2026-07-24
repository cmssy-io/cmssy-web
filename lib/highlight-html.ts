// Server-side syntax highlighting for code blocks inside richText HTML.
// Tiptap renders code as <pre><code class="language-xx">escaped source</code></pre>
// with no highlighting; we replace each block with shiki dual-theme markup
// (light/dark switched via CSS vars, matching the docs-code-block).

const CODE_BLOCK_RE =
  /<pre[^>]*>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi;

function decodeEntities(source: string): string {
  return source
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

export async function highlightRichTextCode(html: string): Promise<string> {
  const matches = [...html.matchAll(CODE_BLOCK_RE)];
  if (matches.length === 0) return html;

  const { codeToHtml } = await import("shiki");
  const themes = { light: "github-light", dark: "github-dark" } as const;

  let out = "";
  let cursor = 0;
  for (const match of matches) {
    const [full, attrs, rawCode] = match;
    const index = match.index ?? 0;
    out += html.slice(cursor, index);

    const langMatch = /language-([a-z0-9+#-]+)/i.exec(attrs);
    const lang = langMatch ? langMatch[1].toLowerCase() : "text";
    const code = decodeEntities(rawCode).replace(/\n$/, "");

    let highlighted: string;
    try {
      highlighted = await codeToHtml(code, {
        lang,
        themes,
        defaultColor: false,
      });
    } catch {
      highlighted = await codeToHtml(code, {
        lang: "text",
        themes,
        defaultColor: false,
      });
    }
    out += highlighted;
    cursor = index + full.length;
  }
  out += html.slice(cursor);
  return out;
}
