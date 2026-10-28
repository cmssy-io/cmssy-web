"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createTabChoiceStore, tabSyncStorageKey } from "./docs-tab-sync";

const store = createTabChoiceStore(() => window.localStorage);

function subscribe(listener: () => void) {
  const unsubscribe = store.subscribe(listener);
  window.addEventListener("storage", store.notify);
  return () => {
    unsubscribe();
    window.removeEventListener("storage", store.notify);
  };
}

export function useSyncedTab(syncKey: string | undefined) {
  const key = syncKey ? tabSyncStorageKey(syncKey) : null;

  const chosen = useSyncExternalStore(
    subscribe,
    () => (key ? store.read(key) : null),
    () => null,
  );

  const choose = useCallback(
    (label: string) => {
      if (key) store.choose(key, label);
    },
    [key],
  );

  return { chosen, choose };
}
