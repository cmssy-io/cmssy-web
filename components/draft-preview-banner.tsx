import { draftMode } from "next/headers";
import { fetchPage } from "@cmssy/core";
import { cmssy } from "@/cmssy/config";

const ADMIN_URL = process.env.CMSSY_ADMIN_URL?.trim() || "https://cmssy.io";

export async function DraftPreviewBanner({ path }: { path?: string[] }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  const currentPath = "/" + (path ?? []).filter(Boolean).join("/");
  const exitHref = `/api/draft?disable=1&redirect=${encodeURIComponent(currentPath)}`;

  const page = await fetchPage(cmssy, path, {
    previewSecret: cmssy.draftSecret,
  }).catch(() => null);
  const editHref = page
    ? `${ADMIN_URL}/dashboard/organizations/${cmssy.org}/workspaces/${cmssy.workspaceSlug}/editor?pageId=${page.id}`
    : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-elektryk/30 bg-ink-deep/95 px-4 py-3 backdrop-blur">
      <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-paper/70 uppercase">
        <span className="h-2 w-2 animate-pulse rounded-full bg-elektryk" />
        Draft preview
      </span>
      <span className="hidden text-[13px] text-paper/50 sm:inline">
        You are viewing unpublished content
      </span>
      <span className="flex items-center gap-3">
        {editHref ? (
          <a
            href={editHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-elektryk px-4 py-1.5 text-[13px] font-medium text-ink-deep transition hover:bg-elektryk-300"
          >
            Open in editor
          </a>
        ) : null}
        <a
          href={exitHref}
          className="text-[13px] text-paper/60 underline underline-offset-4 transition hover:text-paper"
        >
          Exit preview
        </a>
      </span>
    </div>
  );
}
