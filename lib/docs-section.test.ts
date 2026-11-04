import { beforeEach, describe, expect, it, vi } from "vitest";

const listChildPages = vi.fn();

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

vi.mock("@/services/pages", () => ({
  CONTENT_TAG: "cmssy-content",
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
  "/docs/blocks/fields/text": [page("/docs/blocks/fields/text/value", "Value")],
};

beforeEach(() => {
  listChildPages.mockReset();
  listChildPages.mockImplementation(async (slug: string) => tree[slug] ?? []);
});

describe("loadDocsSection", () => {
  it("builds one tab per area and walks every level for counts, search and the sidebar", async () => {
    const section = await loadDocsSection(["docs", "blocks", "fields"], "en", "en");
    expect(section?.areas.map((area) => [area.slug, area.pageCount])).toEqual([
      ["/docs/start", 1],
      ["/docs/blocks", 3],
    ]);
    expect(section?.area?.slug).toBe("/docs/blocks");
    expect(section?.searchItems.map((item) => item.slug)).toContain(
      "/docs/blocks/fields/text/value",
    );
    expect(
      section?.nav.flatMap((group) =>
        group.pages.map((item) => [item.slug, item.depth]),
      ),
    ).toEqual([
      ["/docs/blocks", 0],
      ["/docs/blocks/fields", 0],
      ["/docs/blocks/fields/text", 1],
      ["/docs/blocks/fields/text/value", 2],
    ]);
  });

  it("asks the delivery API once per page even when a page is listed twice", async () => {
    const install = page("/docs/start/install", "Install");
    listChildPages.mockImplementation(async (slug: string) =>
      slug === "/docs/start" ? [install, install] : (tree[slug] ?? []),
    );
    const section = await loadDocsSection(["docs"], "en", "en");
    expect(section?.areas[0]?.pageCount).toBe(1);
    expect(
      listChildPages.mock.calls.filter(([slug]) => slug === "/docs/start/install"),
    ).toHaveLength(1);
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
