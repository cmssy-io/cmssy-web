import { beforeEach, describe, expect, it, vi } from "vitest";

const loadPosts = vi.fn();

vi.mock("./load-posts", () => ({ loadPosts }));
vi.mock("./src/BlogPosts", () => ({ default: () => null }));

const { blogPostsBlock } = await import("./block");

const runLoader = (
  parentPage: unknown,
  overrides: Record<string, unknown> = {},
) =>
  blogPostsBlock.loader?.({
    content: { parentPage, postsPerPage: "9", ...overrides },
    context: {},
  } as never);

describe("blog-posts loader", () => {
  beforeEach(() => {
    loadPosts.mockReset();
    loadPosts.mockResolvedValue({
      items: [{ slug: "/blog/one" }],
      hasMore: false,
    });
  });

  it("queries when a single page selector hands over a bare object", async () => {
    const data = await runLoader({
      slug: "/blog",
      displayName: { en: "Blog" },
    });

    expect(loadPosts).toHaveBeenCalledWith({
      parentSlug: "/blog",
      limit: 9,
      offset: 0,
    });
    expect(data).toEqual({ items: [{ slug: "/blog/one" }], hasMore: false });
  });

  it("queries when the selector hands over a list", async () => {
    await runLoader([{ slug: "/blog", displayName: { en: "Blog" } }]);

    expect(loadPosts).toHaveBeenCalledWith({
      parentSlug: "/blog",
      limit: 9,
      offset: 0,
    });
  });

  it("does not query when no parent page is picked", async () => {
    expect(await runLoader(undefined)).toBeNull();
    expect(loadPosts).not.toHaveBeenCalled();
  });

  it("takes the page count from the block, falling back to nine", async () => {
    await runLoader("/blog", { postsPerPage: "3" });
    expect(loadPosts).toHaveBeenCalledWith({
      parentSlug: "/blog",
      limit: 3,
      offset: 0,
    });

    loadPosts.mockClear();
    await runLoader("/blog", { postsPerPage: "not a number" });
    expect(loadPosts).toHaveBeenCalledWith({
      parentSlug: "/blog",
      limit: 9,
      offset: 0,
    });
  });
});
