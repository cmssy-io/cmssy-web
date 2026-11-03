import { describe, expect, it } from "vitest";
import {
  docsSlugFromParams,
  htmlToMarkdown,
  markdownHref,
  pageToMarkdown,
} from "./docs-markdown";

const options = {
  base: "https://www.cmssy.com",
  locale: "en",
  fallbackLocale: "en",
};

const page = (type: string, content: Record<string, unknown>) =>
  pageToMarkdown(
    {
      title: "Page",
      url: "https://www.cmssy.com/docs/page",
      blocks: [{ type, content: { en: content } }],
    },
    options,
  );

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

  it("renders tables and escapes a pipe in a cell", () => {
    expect(
      htmlToMarkdown(
        "<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td><code>a|b</code></td><td>c</td></tr></tbody></table>",
      ),
    ).toBe("| A | B |\n| --- | --- |\n| `a\\|b` | c |");
  });

  it("numbers ordered lists and nests a list under its item", () => {
    expect(htmlToMarkdown("<ol><li>One<ul><li>Sub</li></ul></li><li>Two</li></ol>")).toBe(
      "1. One\n   - Sub\n2. Two",
    );
  });
});

describe("markdownHref", () => {
  it("points docs at the Markdown twin and leaves the rest alone", () => {
    expect(markdownHref("/docs/blocks", "https://s.com")).toBe("https://s.com/docs/blocks.md");
    expect(markdownHref("/pricing", "https://s.com")).toBe("https://s.com/pricing");
    expect(markdownHref("https://x.dev/a", "https://s.com")).toBe("https://x.dev/a");
    expect(markdownHref("#here", "https://s.com")).toBe("#here");
  });
});

describe("pageToMarkdown", () => {
  it("opens with front matter an agent can read", () => {
    const out = pageToMarkdown(
      {
        title: 'Say "hi"',
        description: "Short.",
        url: "https://s.com/docs/x",
        lastUpdated: "2026-11-03",
        blocks: [],
      },
      options,
    );
    expect(out).toContain('title: "Say \\"hi\\""');
    expect(out).toContain("last_updated: 2026-11-03");
    expect(out).toContain('\n# Say "hi"\n');
  });

  it("numbers steps and quotes a callout", () => {
    expect(page("docs-steps", { steps: [{ title: "Go", content: "<p>Now</p>" }] })).toContain(
      "### 1. Go\n\nNow",
    );
    expect(page("docs-callout", { type: "tip", title: "T", content: "<p>B</p>" })).toContain(
      "> **TIP: T**\n> \n> B",
    );
  });

  it("falls back to the default language", () => {
    const out = pageToMarkdown(
      {
        title: "P",
        url: "u",
        blocks: [{ type: "docs-article", content: { en: { content: "<p>Hello</p>" } } }],
      },
      { ...options, locale: "pl" },
    );
    expect(out).toContain("Hello");
  });

  it("drops navigation and hands an unknown block to the fallback", () => {
    expect(page("docs-sidebar", { title: "Nav" })).not.toContain("Nav");
    const out = pageToMarkdown(
      { title: "P", url: "u", blocks: [{ type: "new-one", content: { en: { a: 1 } } }] },
      { ...options, fallback: (type) => `from ${type}` },
    );
    expect(out).toContain("from new-one");
  });

  it("lists MCP tools by name", () => {
    expect(
      page("docs-tool-catalogue", {
        title: "Tools",
        noPermissionLabel: "none",
        tools: [
          { name: "z_tool", permission: "a:b", description: "Z." },
          { name: "a_tool", description: "A." },
        ],
      }),
    ).toContain("- `a_tool` (none): A.\n- `z_tool` (a:b): Z.");
  });
});

describe("docsSlugFromParams", () => {
  it("handles the root, segments and one encoded segment", () => {
    expect(docsSlugFromParams(undefined)).toBe("/docs");
    expect(docsSlugFromParams(["start", "env"])).toBe("/docs/start/env");
    expect(docsSlugFromParams(["start%2Fenv"])).toBe("/docs/start/env");
  });
});
