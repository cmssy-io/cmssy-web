import { beforeEach, describe, expect, it, vi } from "vitest";

const listChildPages = vi.fn();
const getDocsPage = vi.fn();

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

vi.mock("@/services/pages", () => ({
  CONTENT_TAG: "cmssy-content",
  listChildPages: (...args: unknown[]) => listChildPages(...args),
  getDocsPage: (...args: unknown[]) => getDocsPage(...args),
  getPageById: vi.fn(),
}));

vi.mock("@/services/site", () => ({
  resolveSiteLocales: async () => ({ defaultLocale: "en", locales: ["en"] }),
}));

vi.mock("@/lib/site-url", () => ({ siteUrl: () => "https://www.cmssy.com" }));

vi.mock("@/cmssy/blocks", () => ({ blocks: [] }));

const { loadDocsMarkdown } = await import("./docs-markdown");

beforeEach(() => {
  listChildPages.mockReset();
  getDocsPage.mockReset();
});

describe("loadDocsMarkdown", () => {
  it("takes the title and description from the page, not the cached listing", async () => {
    listChildPages.mockResolvedValue([
      {
        id: "p1",
        fullSlug: "/docs/api/cli",
        displayName: { en: "Old CLI" },
        seoDescription: { en: "Old description." },
      },
    ]);
    getDocsPage.mockResolvedValue({
      id: "p1",
      blocks: [],
      displayName: { en: "CLI" },
      seoDescription: { en: "New description." },
    });

    const markdown = await loadDocsMarkdown("/docs/api/cli");

    expect(listChildPages).toHaveBeenCalledWith("/docs/api");
    expect(getDocsPage).toHaveBeenCalledWith("p1");
    expect(markdown).toContain('title: "CLI"');
    expect(markdown).toContain('description: "New description."');
    expect(markdown).not.toContain("Old");
  });

  it("answers null when the page cannot be loaded", async () => {
    listChildPages.mockResolvedValue([{ id: "p1", fullSlug: "/docs/api/cli" }]);
    getDocsPage.mockResolvedValue(null);

    expect(await loadDocsMarkdown("/docs/api/cli")).toBeNull();
  });
});
