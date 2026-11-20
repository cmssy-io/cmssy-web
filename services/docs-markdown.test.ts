import { beforeEach, describe, expect, it, vi } from "vitest";

const listChildPages = vi.fn();
const readDocsPage = vi.fn();

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

vi.mock("@/services/pages", () => ({
  CONTENT_TAG: "cmssy-content",
  readChildPages: (...args: unknown[]) => listChildPages(...args),
  readDocsPage: (...args: unknown[]) => readDocsPage(...args),
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
  readDocsPage.mockReset();
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
    readDocsPage.mockResolvedValue({
      id: "p1",
      blocks: [],
      displayName: { en: "CLI" },
      seoDescription: { en: "New description." },
    });

    const markdown = await loadDocsMarkdown("/docs/api/cli");

    expect(listChildPages).toHaveBeenCalledWith("/docs/api");
    expect(readDocsPage).toHaveBeenCalledWith("p1");
    expect(markdown).toContain('title: "CLI"');
    expect(markdown).toContain('description: "New description."');
    expect(markdown).not.toContain("Old");
  });

  it("answers null when the page cannot be loaded", async () => {
    listChildPages.mockResolvedValue([{ id: "p1", fullSlug: "/docs/api/cli" }]);
    readDocsPage.mockResolvedValue(null);

    expect(await loadDocsMarkdown("/docs/api/cli")).toBeNull();
  });

  it("fails instead of answering null when the CMS read fails", async () => {
    listChildPages.mockResolvedValue([{ id: "p1", fullSlug: "/docs/api/cli" }]);
    readDocsPage.mockRejectedValue(new Error("502"));

    await expect(loadDocsMarkdown("/docs/api/cli")).rejects.toThrow("502");
  });
});
