import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isChunkLoadError, reloadOnChunkLoadError } from "./chunk-reload";

function chunkLoadError() {
  const error = new Error("Failed to load chunk /_next/static/chunks/a.js");
  error.name = "ChunkLoadError";
  return error;
}

describe("isChunkLoadError", () => {
  it("matches the error Turbopack throws", () => {
    expect(isChunkLoadError(chunkLoadError())).toBe(true);
  });

  it("ignores other errors and non-errors", () => {
    expect(isChunkLoadError(new Error("boom"))).toBe(false);
    expect(isChunkLoadError("ChunkLoadError")).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });
});

describe("reloadOnChunkLoadError", () => {
  const reload = vi.fn();
  let store: Map<string, string>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_800_000_000_000);
    reload.mockClear();
    store = new Map();
    vi.stubGlobal("window", {
      location: { reload },
      sessionStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("reloads on a chunk load error", () => {
    expect(reloadOnChunkLoadError(chunkLoadError())).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
  });

  it("does not reload on any other error", () => {
    expect(reloadOnChunkLoadError(new Error("boom"))).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it("does not loop when the chunk is still missing after the reload", () => {
    reloadOnChunkLoadError(chunkLoadError());
    vi.advanceTimersByTime(2_000);

    expect(reloadOnChunkLoadError(chunkLoadError())).toBe(false);
    expect(reload).toHaveBeenCalledOnce();
  });

  it("recovers again once the guard window has passed", () => {
    reloadOnChunkLoadError(chunkLoadError());
    vi.advanceTimersByTime(10_000);

    expect(reloadOnChunkLoadError(chunkLoadError())).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("does not reload when the guard cannot be stored", () => {
    vi.stubGlobal("window", {
      location: { reload },
      sessionStorage: {
        getItem: () => {
          throw new Error("blocked");
        },
      },
    });

    expect(reloadOnChunkLoadError(chunkLoadError())).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
