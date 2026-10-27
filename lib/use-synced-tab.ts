"use client";

import { useCallback, useSyncExternalStore } from "react";
import { tabSyncStorageKey } from "./docs-tab-sync";

const listeners = new Set<() => void>();
const unsaved = new Map<string, string>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string): string | null {
  if (unsaved.has(key)) return unsaved.get(key) ?? null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useSyncedTab(syncKey: string | undefined) {
  const key = syncKey ? tabSyncStorageKey(syncKey) : null;

  const chosen = useSyncExternalStore(
    subscribe,
    () => (key ? read(key) : null),
    () => null,
  );

  const choose = useCallback(
    (label: string) => {
      if (!key) return;
      try {
        localStorage.setItem(key, label);
        unsaved.delete(key);
      } catch {
        unsaved.set(key, label);
      }
      for (const listener of listeners) listener();
    },
    [key],
  );

  return { chosen, choose };
}
