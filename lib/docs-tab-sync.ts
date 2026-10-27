export const TAB_SYNC_STORAGE_PREFIX = "cmssy-docs-tab:";

export function tabSyncStorageKey(syncKey: string): string {
  return `${TAB_SYNC_STORAGE_PREFIX}${syncKey}`;
}

export function resolveTabIndex(
  labels: string[],
  chosen: string | null,
  local: number,
): number {
  const synced = chosen === null ? -1 : labels.indexOf(chosen);
  if (synced >= 0) return synced;
  return Math.min(Math.max(0, local), Math.max(0, labels.length - 1));
}

export function hasCode(html: string): boolean {
  return /<pre[\s>]/i.test(html);
}
