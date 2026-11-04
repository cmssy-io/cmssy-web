import { beforeEach, describe, expect, it, vi } from "vitest";

const listChildPages = vi.fn();

vi.mock("@/services/pages", () => ({
  listChildPages: (...args: unknown[]) => listChildPages(...args),
}));

const { loadDocsSection } = await import("./docs-section");

function page(fullSlug: string, title: string) {
  return { id: fullSlug, fullSlug, displayName: { en: title }, customFields: [] };
}

const tree: Record<string, ReturnType<typeof page>[]> = {
  "/": [page("/docs", "Docs")],
  "/docs": [page("/docs/start", "Start"), page("/docs/blocks", "Blocks")],
  "/docs/start": [page("/docs/start/install", "Install")],
  "/docs/blocks": [page("/docs/blocks/fields", "Fields")],
  "/docs/blocks/fields": [page("/docs/blocks/fields/text", "Text")],
};

beforeEach(() => {
  listChildPages.mockReset();
  listChildPages.mockImplementation(async (slug: string) => tree[slug] ?? []);
});

describe("loadDocsSection", () => {
  it("builds one tab per area, counts the whole subtree and indexes three levels", async () => {
    const section = await loadDocsSection(["docs", "blocks", "fields"], "en", "en");
    expect(section?.areas.map((area) => [area.slug, area.pageCount])).toEqual([
      ["/docs/start", 1],
      ["/docs/blocks", 2],
    ]);
    expect(section?.area?.slug).toBe("/docs/blocks");
    expect(section?.searchItems.map((item) => item.slug)).toContain(
      "/docs/blocks/fields/text",
    );
    expect(
      section?.nav.flatMap((group) => group.pages.map((item) => item.slug)),
    ).toEqual(["/docs/blocks", "/docs/blocks/fields", "/docs/blocks/fields/text"]);
  });

  it("has no area and an empty sidebar on the docs root", async () => {
    const section = await loadDocsSection(["docs"], "en", "en");
    expect(section?.area).toBeNull();
    expect(section?.nav).toEqual([]);
  });

  it("returns null outside a known root", async () => {
    expect(await loadDocsSection(["blog"], "en", "en")).toBeNull();
  });
});
