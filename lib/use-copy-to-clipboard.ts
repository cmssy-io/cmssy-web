"use client";

import { useCallback, useState } from "react";

/**
 * Copy text to the clipboard and expose a `copied` flag that auto-resets
 * after `resetMs` (default 2s) - for "Copy" / "Copied!" buttons.
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [resetMs],
  );

  return { copied, copy };
}
