const STORAGE_KEY = "cmssy:chunk-reload-at";
const RELOAD_GUARD_MS = 10_000;

export function isChunkLoadError(error: unknown): boolean {
  return error instanceof Error && error.name === "ChunkLoadError";
}

export function reloadOnChunkLoadError(error: unknown): boolean {
  if (!isChunkLoadError(error)) return false;

  try {
    const lastReloadAt = Number(window.sessionStorage.getItem(STORAGE_KEY));
    if (Date.now() - lastReloadAt < RELOAD_GUARD_MS) return false;
    window.sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    return false;
  }

  window.location.reload();
  return true;
}
