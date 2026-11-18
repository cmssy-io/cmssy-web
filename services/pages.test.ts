import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NEXT_BUILD_PHASE } from "@cmssy/next";

const queryScoped = vi.fn();
const graphqlRequest = vi.fn();

vi.mock("react", async (importActual) => ({
  ...(await importActual<typeof import("react")>()),
  cache: <F>(fn: F) => fn,
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

vi.mock("@/cmssy/config", () => ({
  cmssy: { org: "cmssy", workspaceSlug: "cmssy", apiUrl: "https://api.test/graphql" },
}));

vi.mock("@cmssy/react", () => ({
  createCmssyClient: () => ({ queryScoped }),
}));

vi.mock("@cmssy/core", async (importActual) => ({
  ...(await importActual<typeof import("@cmssy/core")>()),
  graphqlRequest: (...args: unknown[]) => graphqlRequest(...args),
}));

const { listChildPages, getPageId } = await import("./pages");

const throttled = new Error("cmssy: request failed (429)");

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  queryScoped.mockReset();
  graphqlRequest.mockReset();
});

describe("listChildPages during next build (CMS-2268)", () => {
  it("fails the build when the read is throttled", async () => {
    vi.stubEnv("NEXT_PHASE", NEXT_BUILD_PHASE);
    queryScoped.mockRejectedValue(throttled);

    await expect(listChildPages("/docs")).rejects.toBe(throttled);
  });

  it("degrades to an empty nav and logs it at runtime", async () => {
    queryScoped.mockRejectedValue(throttled);

    await expect(listChildPages("/docs")).resolves.toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      "[cmssy-web] child pages of /docs could not be fetched",
      throttled,
    );
  });

  it("shares one request between concurrent reads of the same section", async () => {
    let release: (value: unknown) => void = () => {};
    queryScoped.mockReturnValue(
      new Promise((resolve) => {
        release = resolve;
      }),
    );

    const reads = Promise.all([
      listChildPages("/docs"),
      listChildPages("/docs"),
    ]);
    release({
      public: { page: { byType: { items: [{ id: "a", fullSlug: "/docs/a" }] } } },
    });

    expect(await reads).toEqual([
      [{ id: "a", fullSlug: "/docs/a" }],
      [{ id: "a", fullSlug: "/docs/a" }],
    ]);
    expect(queryScoped).toHaveBeenCalledTimes(1);
  });

  it("asks again once the earlier read has settled", async () => {
    queryScoped.mockResolvedValue({ public: { page: { byType: { items: [] } } } });

    await listChildPages("/docs");
    await listChildPages("/docs");

    expect(queryScoped).toHaveBeenCalledTimes(2);
  });

  it("does not share a request between two sections", async () => {
    queryScoped.mockResolvedValue({ public: { page: { byType: { items: [] } } } });

    await Promise.all([listChildPages("/docs"), listChildPages("/blog")]);

    expect(queryScoped).toHaveBeenCalledTimes(2);
  });
});

describe("page reads during next build (CMS-2268)", () => {
  it("fails the build instead of prerendering a missing page", async () => {
    vi.stubEnv("NEXT_PHASE", NEXT_BUILD_PHASE);
    graphqlRequest.mockRejectedValue(throttled);

    await expect(getPageId("/pricing")).rejects.toBe(throttled);
  });

  it("reads a failure as no page at runtime", async () => {
    graphqlRequest.mockRejectedValue(throttled);

    await expect(getPageId("/pricing")).resolves.toBeNull();
  });
});
