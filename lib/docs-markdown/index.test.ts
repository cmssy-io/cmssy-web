import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { handledDocsBlocks } from "./blocks";
import { docsSlugFromParams, pageToMarkdown } from "./index";

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
    expect(
      page("docs-steps", { steps: [{ title: "Go", content: "<p>Now</p>" }] }),
    ).toContain("### 1. Go\n\nNow");
    expect(
      page("docs-callout", { type: "tip", title: "T", content: "<p>B</p>" }),
    ).toContain("> **TIP: T**\n> \n> B");
  });

  it("keeps a link's description", () => {
    expect(
      page("docs-card-grid", {
        cards: [{ title: "MCP", url: "/docs/api/mcp", description: "Connect." }],
      }),
    ).toContain("- [MCP](https://www.cmssy.com/docs/api/mcp.md): Connect.");
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

  it("renders nothing for a terminal without commands", () => {
    expect(page("docs-terminal", { commands: [] })).not.toContain("```");
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

describe("docs blocks", () => {
  it("every docs block has a decided Markdown form", () => {
    const docsBlocks = readdirSync("blocks").filter((name) => name.startsWith("docs-"));
    expect(docsBlocks.filter((name) => !handledDocsBlocks.has(name))).toEqual([]);
  });
});

describe("docsSlugFromParams", () => {
  it("handles the root, segments and one encoded segment", () => {
    expect(docsSlugFromParams(undefined)).toBe("/docs");
    expect(docsSlugFromParams(["start", "env"])).toBe("/docs/start/env");
    expect(docsSlugFromParams(["start%2Fenv"])).toBe("/docs/start/env");
  });

  it("answers null, not a throw, to a malformed segment", () => {
    expect(docsSlugFromParams(["%E0%A4%A"])).toBeNull();
  });
});
