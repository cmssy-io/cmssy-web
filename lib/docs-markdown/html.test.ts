import { describe, expect, it } from "vitest";
import { htmlToMarkdown, markdownHref } from "./html";

describe("htmlToMarkdown", () => {
  it("keeps a code fence with its language and leaves the code literal", () => {
    expect(
      htmlToMarkdown(
        '<pre><code class="language-tsx">const a = &lt;b&gt;*x*&lt;/b&gt;;\n</code></pre>',
      ),
    ).toBe("```tsx\nconst a = <b>*x*</b>;\n```");
  });

  it("fences code that itself holds a code fence", () => {
    expect(htmlToMarkdown("<pre><code>```\nx\n```</code></pre>")).toBe(
      "````\n```\nx\n```\n````",
    );
  });

  it("renders inline marks, headings and absolute links", () => {
    expect(
      htmlToMarkdown(
        '<h2 id="a">One</h2><p><strong>B</strong> and <code>c</code>, see <a href="/docs/api/mcp#x">MCP</a>.</p>',
        "https://s.com",
      ),
    ).toBe("## One\n\n**B** and `c`, see [MCP](https://s.com/docs/api/mcp.md#x).");
  });

  it("escapes Markdown characters in prose", () => {
    expect(htmlToMarkdown("<p>2 *3* is not emphasis</p>")).toContain("\\*3\\*");
  });

  it("renders tables and escapes a pipe in any cell", () => {
    const out = htmlToMarkdown(
      "<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td><code>a|b</code></td><td>c|d</td></tr></tbody></table>",
    );
    expect(out).toContain("| A | B |");
    expect(out).toContain("`a\\|b`");
    expect(out).toContain("c\\|d");
  });

  it("numbers ordered lists and nests a list under its item", () => {
    expect(
      htmlToMarkdown("<ol><li>One<ul><li>Sub</li></ul></li><li>Two</li></ol>"),
    ).toBe("1. One\n   - Sub\n2. Two");
  });
});

describe("markdownHref", () => {
  it("points docs at the Markdown twin and leaves the rest alone", () => {
    expect(markdownHref("/docs/blocks", "https://s.com")).toBe(
      "https://s.com/docs/blocks.md",
    );
    expect(markdownHref("/pricing", "https://s.com")).toBe("https://s.com/pricing");
    expect(markdownHref("https://x.dev/a", "https://s.com")).toBe("https://x.dev/a");
    expect(markdownHref("#here", "https://s.com")).toBe("#here");
    expect(markdownHref("//cdn.x.dev/a.png", "https://s.com")).toBe("//cdn.x.dev/a.png");
  });

  it("keeps both the query and the fragment", () => {
    expect(markdownHref("/docs/a?x=1#y", "https://s.com")).toBe(
      "https://s.com/docs/a.md?x=1#y",
    );
  });
});
