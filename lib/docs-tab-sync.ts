export const TAB_SYNC_STORAGE_PREFIX = "cmssy-docs-tab:";

export type TabChoiceStorage = Pick<Storage, "getItem" | "setItem">;

export function tabSyncStorageKey(syncKey: string): string {
  return `${TAB_SYNC_STORAGE_PREFIX}${syncKey}`;
}

export function resolveTabIndex(
  labels: string[],
  chosen: string | null,
  local: number,
): number {
  const clamped = Math.min(Math.max(0, local), Math.max(0, labels.length - 1));
  if (chosen === null || labels[clamped] === chosen) return clamped;
  const synced = labels.indexOf(chosen);
  return synced >= 0 ? synced : clamped;
}

export function hasCode(html: string): boolean {
  return /<pre[\s>]/i.test(html);
}

export function createTabChoiceStore(storage: () => TabChoiceStorage) {
  const listeners = new Set<() => void>();
  const unsaved = new Map<string, string>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    notify() {
      for (const listener of listeners) listener();
    },
    read(key: string): string | null {
      if (unsaved.has(key)) return unsaved.get(key) ?? null;
      try {
        return storage().getItem(key);
      } catch {
        return null;
      }
    },
    choose(key: string, label: string) {
      try {
        storage().setItem(key, label);
        unsaved.delete(key);
      } catch {
        unsaved.set(key, label);
      }
      for (const listener of listeners) listener();
    },
  };
}
