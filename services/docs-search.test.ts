import { beforeEach, describe, expect, it, vi } from "vitest";
import { fields } from "@cmssy/react";

const listChildPages = vi.fn();
const getPageById = vi.fn();

vi.mock("@/services/pages", () => ({
  CONTENT_TAG: "cmssy-content",
  listChildPages: (...args: unknown[]) => listChildPages(...args),
  getPageById: (...args: unknown[]) => getPageById(...args),
}));

vi.mock("@/cmssy/blocks", () => ({
  blocks: [
    {
      type: "docs-article",
      props: {
        title: fields.text({ label: "Title" }),
        content: fields.richText({ label: "Content" }),
      },
    },
  ],
}));

const { buildDocsSearchBodies, mapWithLimit } = await import("./docs-search");

function page(id: string, fullSlug: string) {
  return { id, fullSlug };
}

function article(title: string, content: string, locale = "en") {
  return {
    id: "b1",
    type: "docs-article",
    content: { [locale]: { title, content } },
  };
}

beforeEach(() => {
  listChildPages.mockReset();
  getPageById.mockReset();
});

describe("buildDocsSearchBodies", () => {
  it("walks sections and their children, and reads the requested locale", async () => {
    listChildPages.mockImplementation(async (parent: string) => {
      if (parent === "/docs") return [page("s1", "/docs/api")];
      if (parent === "/docs/api") return [page("p1", "/docs/api/webhooks")];
      return [];
    });
    getPageById.mockImplementation(async (id: string) =>
      id === "s1"
        ? { id, blocks: [article("API", "<p>Section intro</p>")] }
        : {
            id,
            blocks: [
              article("Webhooks", "<p>Honour Retry-After</p>"),
              { ...article("ignored", "pominięte", "pl") },
            ],
          },
    );

    expect(await buildDocsSearchBodies("en", "en")).toEqual([
      { slug: "/docs/api", body: "API Section intro" },
      { slug: "/docs/api/webhooks", body: "Webhooks Honour Retry-After" },
    ]);
  });

  it("indexes the locale asked for, not the default one", async () => {
    listChildPages.mockImplementation(async (parent: string) =>
      parent === "/docs" ? [page("p1", "/docs/api")] : [],
    );
    getPageById.mockResolvedValue({
      id: "p1",
      blocks: [
        {
          id: "b1",
          type: "docs-article",
          content: {
            en: { title: "Rate limits", content: "" },
            pl: { title: "Limity zapytań", content: "" },
          },
        },
      ],
    });

    expect(await buildDocsSearchBodies("pl", "en")).toEqual([
      { slug: "/docs/api", body: "Limity zapytań" },
    ]);
  });

  it("indexes what the page renders, falling back the way the renderer does", async () => {
    listChildPages.mockImplementation(async (parent: string) =>
      parent === "/docs" ? [page("p1", "/docs/rendering/layout-regions")] : [],
    );
    getPageById.mockResolvedValue({
      id: "p1",
      blocks: [article("Layout regions", "<p>Declare your regions</p>", "en")],
    });

    expect(await buildDocsSearchBodies("de", "en")).toEqual([
      { slug: "/docs/rendering/layout-regions", body: "Layout regions Declare your regions" },
    ]);
  });

  it("prefers the asked-for locale over the fallback when both exist", async () => {
    listChildPages.mockImplementation(async (parent: string) =>
      parent === "/docs" ? [page("p1", "/docs/api")] : [],
    );
    getPageById.mockResolvedValue({
      id: "p1",
      blocks: [
        {
          id: "b1",
          type: "docs-article",
          content: {
            en: { title: "Rate limits", content: "" },
            de: { title: "Ratenbegrenzungen", content: "" },
          },
        },
      ],
    });

    expect(await buildDocsSearchBodies("de", "en")).toEqual([
      { slug: "/docs/api", body: "Ratenbegrenzungen" },
    ]);
  });

  it("keeps the pages it could read when one of them fails", async () => {
    listChildPages.mockImplementation(async (parent: string) =>
      parent === "/docs"
        ? [page("ok", "/docs/api"), page("gone", "/docs/missing")]
        : [],
    );
    getPageById.mockImplementation(async (id: string) =>
      id === "ok" ? { id, blocks: [article("API", "")] } : null,
    );

    expect(await buildDocsSearchBodies("en", "en")).toEqual([
      { slug: "/docs/api", body: "API" },
    ]);
  });

  it("asks for a page once even when the tree lists it twice", async () => {
    listChildPages.mockImplementation(async (parent: string) => {
      if (parent === "/docs") return [page("s1", "/docs/api")];
      if (parent === "/docs/api") return [page("s1", "/docs/api")];
      return [];
    });
    getPageById.mockResolvedValue({ id: "s1", blocks: [article("API", "")] });

    const entries = await buildDocsSearchBodies("en", "en");
    expect(entries).toHaveLength(1);
    expect(getPageById).toHaveBeenCalledTimes(1);
  });

  it("never asks delivery for more pages at once than its rate limit tolerates", async () => {
    const many = Array.from({ length: 40 }, (_, i) =>
      page(`p${i}`, `/docs/api/page-${i}`),
    );
    listChildPages.mockImplementation(async (parent: string) =>
      parent === "/docs" ? many : [],
    );

    let inFlight = 0;
    let peak = 0;
    getPageById.mockImplementation(async (id: string) => {
      inFlight += 1;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 1));
      inFlight -= 1;
      return { id, blocks: [article("Page", "")] };
    });

    await buildDocsSearchBodies("en", "en");

    expect(getPageById).toHaveBeenCalledTimes(40);
    expect(peak).toBeLessThanOrEqual(8);
    expect(peak).toBeGreaterThan(1);
  });

  it("drops a page whose blocks carry no prose rather than shipping an empty entry", async () => {
    listChildPages.mockImplementation(async (parent: string) =>
      parent === "/docs" ? [page("p1", "/docs/api")] : [],
    );
    getPageById.mockResolvedValue({
      id: "p1",
      blocks: [{ id: "b1", type: "docs-article", content: { en: {} } }],
    });

    expect(await buildDocsSearchBodies("en", "en")).toEqual([]);
  });
});

describe("mapWithLimit", () => {
  it("refuses to run more than the limit at once, which is what keeps delivery under its rate limit", async () => {
    let inFlight = 0;
    let peak = 0;
    const input = Array.from({ length: 30 }, (_, i) => i);

    const results = await mapWithLimit(input, 6, async (value) => {
      inFlight += 1;
      peak = Math.max(peak, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 1));
      inFlight -= 1;
      return value * 2;
    });

    expect(peak).toBeLessThanOrEqual(6);
    expect(peak).toBeGreaterThan(1);
    expect(results).toEqual(input.map((value) => value * 2));
  });

  it("keeps results in input order however the work finishes", async () => {
    const results = await mapWithLimit([30, 10, 20], 3, async (ms) => {
      await new Promise((resolve) => setTimeout(resolve, ms));
      return ms;
    });

    expect(results).toEqual([30, 10, 20]);
  });
});
