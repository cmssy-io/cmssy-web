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

  /**
   * Copy text that still has to load. The clipboard write starts inside the
   * click, because Safari refuses one that begins after an await.
   */
  const copyLoaded = useCallback(
    async (load: () => Promise<string>) => {
      try {
        if (typeof ClipboardItem === "undefined") {
          await navigator.clipboard.writeText(await load());
        } else {
          await navigator.clipboard.write([
            new ClipboardItem({
              "text/plain": load().then(
                (text) => new Blob([text], { type: "text/plain" }),
              ),
            }),
          ]);
        }
      } catch {
        return false;
      }
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [resetMs],
  );

  return { copied, copy, copyLoaded };
}
