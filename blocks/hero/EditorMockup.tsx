import {
  Boxes,
  FileText,
  Globe,
  Home,
  Image as ImageIcon,
  Monitor,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
  Users,
} from "lucide-react";
import { CmssyMark } from "@/components/cmssy-mark";

const LOOP = "12s";

function d(delay: string, anim = "hero-snap-in") {
  return {
    animation: `${anim} ${LOOP} cubic-bezier(0.2, 0.9, 0.25, 1) ${delay} infinite both`,
  };
}

export function EditorMockup({
  chatPrompt,
  chatStatus,
  title,
  badge,
  meta,
  pages,
  dockLabel,
  dockTag,
  dockSub,
  inspectorTitle,
  inspectorSubtitle,
  inspectorFooter,
}: {
  chatPrompt: string;
  chatStatus: string;
  title: string;
  badge: string;
  meta: string;
  pages: { name: string; tag?: string }[];
  dockLabel: string;
  dockTag?: string;
  dockSub?: string;
  inspectorTitle?: string;
  inspectorSubtitle?: string;
  inspectorFooter?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper/10 bg-[#14161b] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 border-b border-paper/10 px-4 py-2.5">
        <span className="grid size-6 place-items-center rounded-md bg-white">
          <CmssyMark className="h-3 w-auto text-ink" />
        </span>
        {title && (
          <span className="font-mono text-[12px] text-paper/70">{title}</span>
        )}
        {badge && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
            <span className="size-1 rounded-full bg-emerald-400" />
            {badge}
          </span>
        )}
        <span className="mx-auto hidden items-center gap-1 rounded-md bg-paper/6 p-0.5 md:flex">
          <span className="rounded bg-paper/12 p-1">
            <Monitor className="size-3 text-paper/80" />
          </span>
          <span className="p-1">
            <Tablet className="size-3 text-paper/35" />
          </span>
          <span className="p-1">
            <Smartphone className="size-3 text-paper/35" />
          </span>
        </span>
        <span className="ml-auto flex items-center gap-2.5 md:ml-0">
          <Undo2 className="hidden size-3 text-paper/35 sm:block" />
          <Redo2 className="hidden size-3 text-paper/35 sm:block" />
          {meta && (
            <span className="hidden items-center gap-1 font-mono text-[11px] text-paper/40 sm:flex">
              <Globe className="size-3" />
              {meta}
            </span>
          )}
          <span className="hidden rounded-md border border-paper/15 px-2 py-1 font-mono text-[10px] text-paper/60 sm:block">
            ••• Actions
          </span>
          <span className="grid size-6 place-items-center rounded-full bg-elektryk/20 font-mono text-[9px] text-elektryk">
            AD
          </span>
        </span>
      </div>

      <div className="flex">
        <div className="hidden w-9 shrink-0 flex-col items-center gap-3 border-r border-paper/10 py-3 lg:flex">
          <Home className="size-3.5 text-paper/35" />
          <FileText className="size-3.5 text-elektryk" />
          <ImageIcon className="size-3.5 text-paper/35" />
          <Boxes className="size-3.5 text-paper/35" />
          <Users className="size-3.5 text-paper/35" />
        </div>

        {pages.length > 0 && (
          <div className="hidden w-40 shrink-0 border-r border-paper/10 p-3 sm:block">
            <div className="flex items-center gap-1 rounded-md bg-paper/6 p-0.5 font-mono text-[10px]">
              <span className="rounded bg-paper/12 px-1.5 py-0.5 text-paper/90">
                Pages
              </span>
              <span className="px-1.5 py-0.5 text-paper/40">Layers</span>
              <span className="px-1.5 py-0.5 text-paper/40">Blocks</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-wider text-paper/35 uppercase">
                Pages
              </span>
              <span className="rounded border border-paper/15 px-1 font-mono text-[9px] text-paper/45">
                + New
              </span>
            </div>
            <ul className="mt-2 space-y-0.5 text-[12px]">
              {pages.map((p, i) => (
                <li
                  key={p.name}
                  className={
                    i === 0
                      ? "flex items-center gap-1.5 rounded bg-elektryk/15 px-2 py-1 font-medium text-elektryk"
                      : "flex items-center justify-between gap-1.5 px-2 py-1 text-paper/55"
                  }
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="size-3 opacity-60" />
                    {p.name}
                  </span>
                  {i > 0 && p.tag && (
                    <span className="rounded bg-paper/10 px-1 font-mono text-[9px] text-paper/45">
                      {p.tag}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="dot-grid-light relative min-h-[330px] flex-1 bg-paper p-4">
          <div
            className="hero-anim flex h-8 items-center justify-between rounded-md border border-ink/10 bg-white px-2"
            style={d("0.1s")}
          >
            <span className="h-2.5 w-14 rounded bg-ink/15" />
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-8 rounded bg-ink/10" />
              <span className="h-2 w-8 rounded bg-ink/10" />
              <span className="h-4 w-12 rounded bg-elektryk" />
            </span>
          </div>
          <div
            className="hero-anim relative mt-2 rounded-md border-2 border-elektryk/70 bg-white px-3 py-2.5"
            style={d("0.5s")}
          >
            <span className="absolute -top-2 left-2 rounded-sm bg-elektryk px-1 font-mono text-[8px] text-ink">
              Heading
            </span>
            <span className="absolute -top-1 -left-1 size-1.5 border border-elektryk bg-white" />
            <span className="absolute -top-1 -right-1 size-1.5 border border-elektryk bg-white" />
            <span className="absolute -bottom-1 -left-1 size-1.5 border border-elektryk bg-white" />
            <span className="absolute -right-1 -bottom-1 size-1.5 border border-elektryk bg-white" />
            <div className="h-3 w-3/4 rounded bg-ink/15" />
            <div className="mt-1.5 h-3 w-1/2 rounded bg-ink/15" />
          </div>
          <div
            className="hero-anim mt-2 grid h-16 place-items-center rounded-md border border-ink/10"
            style={{
              ...d("0.9s"),
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(16,20,28,.06) 0 6px, transparent 6px 12px)",
            }}
          >
            <span className="font-mono text-[10px] text-ink/35">
              product shot
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div
              className="hero-anim h-11 rounded-md border border-ink/10 bg-white"
              style={d("1.3s")}
            />
            <div
              className="hero-anim h-11 rounded-md border border-ink/10 bg-white"
              style={d("1.6s")}
            />
          </div>
          {dockLabel && (
            <div
              className="hero-anim mt-2 flex items-center gap-2.5 rounded-md bg-elektryk px-3 py-2"
              style={d("5.4s", "hero-dock")}
            >
              {dockTag && (
                <span className="grid size-6 place-items-center rounded bg-ink/20 font-mono text-[9px] font-semibold text-ink">
                  {dockTag}
                </span>
              )}
              <span className="leading-tight">
                <span className="block text-[11px] font-semibold text-ink">
                  {dockLabel}
                </span>
                {dockSub && (
                  <span className="block font-mono text-[9px] text-ink/60">
                    {dockSub}
                  </span>
                )}
              </span>
            </div>
          )}

          {(chatPrompt || chatStatus) && (
            <div
              className="hero-anim absolute right-3 bottom-3 left-3 flex items-start gap-2.5 rounded-lg bg-ink p-3 shadow-xl"
              style={d("0s", "hero-chat-in")}
            >
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-white">
                <CmssyMark className="h-3 w-auto text-ink" />
              </span>
              <span className="min-w-0 leading-snug">
                <span className="relative block overflow-hidden font-mono text-[11px] whitespace-nowrap text-paper/90">
                  <span
                    className="hero-anim inline-block overflow-hidden align-bottom whitespace-nowrap"
                    style={d("0s", "hero-type")}
                  >
                    {chatPrompt}
                  </span>
                </span>
                {chatStatus && (
                  <span className="mt-0.5 block font-mono text-[10px] text-paper/45">
                    {chatStatus}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="hidden w-44 shrink-0 border-l border-paper/10 p-3 lg:block">
          {inspectorTitle && (
            <div className="text-[12px] font-semibold text-paper/90">
              {inspectorTitle}
            </div>
          )}
          {inspectorSubtitle && (
            <div className="mt-0.5 text-[10px] text-paper/40">
              {inspectorSubtitle}
            </div>
          )}
          <div className="mt-2.5 flex gap-3 border-b border-paper/10 font-mono text-[10px]">
            <span className="border-b border-elektryk pb-1 text-paper/90">
              Content
            </span>
            <span className="pb-1 text-paper/40">Style</span>
            <span className="pb-1 text-paper/40">Advanced</span>
          </div>
          <div className="mt-3 font-mono text-[9px] tracking-wider text-paper/35 uppercase">
            Logo Text
          </div>
          <div className="mt-1 rounded-md bg-[#0f1116] px-2 py-1.5 text-[11px] text-paper/80">
            cmssy
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[9px] tracking-wider text-paper/35 uppercase">
            Navigation Items
            <span className="normal-case">5 items</span>
          </div>
          <div className="mt-1 flex items-center justify-between rounded-md bg-[#0f1116] px-2 py-1.5 text-[11px] text-paper/80">
            <span className="flex items-center gap-1.5">
              <span className="text-paper/30">⋮⋮</span> Product
            </span>
            <span className="text-paper/30">⌃⌄</span>
          </div>
          <div className="mt-3 font-mono text-[9px] tracking-wider text-paper/35 uppercase">
            Dropdown Columns
          </div>
          <div className="mt-1 flex gap-1 rounded-md bg-[#0f1116] p-1 text-center font-mono text-[10px]">
            <span className="flex-1 py-0.5 text-paper/40">none</span>
            <span className="flex-1 py-0.5 text-paper/40">1</span>
            <span className="flex-1 py-0.5 text-paper/40">2</span>
            <span className="flex-1 rounded bg-elektryk py-0.5 font-semibold text-ink">
              3
            </span>
          </div>
          {inspectorFooter && (
            <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-paper/40">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {inspectorFooter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
