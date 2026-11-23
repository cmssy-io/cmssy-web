import { afterEach, describe, expect, it, vi } from "vitest";
import {
  INDEXNOW_ENDPOINT,
  indexNowKey,
  submitToIndexNow,
  urlsForSubject,
} from "./indexnow";

const locales = { defaultLocale: "en", locales: ["en", "pl"] };
const base = "https://www.cmssy.com";

describe("urlsForSubject", () => {
  it("maps a published page to one URL per locale", () => {
    expect(
      urlsForSubject(
        { kind: "page", action: "published", slug: "/blog/x" },
        locales,
        base,
      ),
    ).toEqual(["https://www.cmssy.com/blog/x", "https://www.cmssy.com/pl/blog/x"]);
  });

  it("maps the home page", () => {
    expect(
      urlsForSubject({ kind: "page", action: "updated", slug: "/" }, locales, base),
    ).toEqual(["https://www.cmssy.com/", "https://www.cmssy.com/pl"]);
  });

  it("still sends an unpublished or deleted page", () => {
    for (const action of ["unpublished", "deleted"]) {
      expect(
        urlsForSubject({ kind: "page", action, slug: "/old" }, locales, base),
      ).toHaveLength(2);
    }
  });

  it("sends nothing for a draft, a non-page subject or a missing slug", () => {
    expect(
      urlsForSubject({ kind: "page", action: "created", slug: "/new" }, locales, base),
    ).toEqual([]);
    expect(
      urlsForSubject({ kind: "record", action: "updated", slug: null }, locales, base),
    ).toEqual([]);
    expect(
      urlsForSubject({ kind: "settings", action: "updated" }, locales, base),
    ).toEqual([]);
    expect(urlsForSubject(undefined, locales, base)).toEqual([]);
  });

  it("sends nothing without a base URL or locales", () => {
    const page = { kind: "page", action: "published", slug: "/a" };
    expect(urlsForSubject(page, locales, "")).toEqual([]);
    expect(
      urlsForSubject(page, { defaultLocale: "", locales: [] }, base),
    ).toEqual([]);
  });
});

describe("indexNowKey", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a well-formed key and rejects the rest", () => {
    vi.stubEnv("INDEXNOW_KEY", "a1b2c3d4e5f6");
    expect(indexNowKey()).toBe("a1b2c3d4e5f6");
    vi.stubEnv("INDEXNOW_KEY", "short");
    expect(indexNowKey()).toBeNull();
    vi.stubEnv("INDEXNOW_KEY", "has space in it");
    expect(indexNowKey()).toBeNull();
    vi.stubEnv("INDEXNOW_KEY", "");
    expect(indexNowKey()).toBeNull();
  });
});

describe("submitToIndexNow", () => {
  it("posts host, key, key location and the URLs", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 202 }));
    await submitToIndexNow(
      ["https://www.cmssy.com/a"],
      "a1b2c3d4e5f6",
      base,
      fetchImpl as unknown as typeof fetch,
    );
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(INDEXNOW_ENDPOINT);
    expect(JSON.parse(init.body as string)).toEqual({
      host: "www.cmssy.com",
      key: "a1b2c3d4e5f6",
      keyLocation: "https://www.cmssy.com/indexnow-key.txt",
      urlList: ["https://www.cmssy.com/a"],
    });
  });

  it("does nothing for an empty list", async () => {
    const fetchImpl = vi.fn();
    await submitToIndexNow([], "a1b2c3d4e5f6", base, fetchImpl as never);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("swallows refusals and network errors", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const refused = vi.fn(async () => new Response(null, { status: 403 }));
    const broken = vi.fn(async () => {
      throw new Error("offline");
    });
    await expect(
      submitToIndexNow(["https://www.cmssy.com/a"], "a1b2c3d4e5f6", base, refused as never),
    ).resolves.toBeUndefined();
    await expect(
      submitToIndexNow(["https://www.cmssy.com/a"], "a1b2c3d4e5f6", base, broken as never),
    ).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});
