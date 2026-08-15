"use client";

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
import { AnimatePresence, m } from "motion/react";
import { CmssyMark } from "@/components/cmssy-mark";
import { RESPONSE, SEQUENCE_STEP, SETTLE } from "@/components/motion/presets";
import { Stage } from "./beat";
import { useBeatClock, useTyped } from "./useBeatClock";

export type ChassisProps = {
  chatPrompt: string;
  chatStatus: string;
  title: string;
  badge: string;
  badgeDraft: string;
  meta: string;
  pages: { name: string; tag?: string }[];
  toolCalls: string[];
  dockLabel: string;
  dockTag?: string;
  dockSub?: string;
  inspectorTitle?: string;
  inspectorSubtitle?: string;
  inspectorFooter?: string;
  codeLine: string;
  codeDataLabel: string;
  caption: string;
  captionDone: string;
};

function Signal({
  on,
  className,
  axis,
}: {
  on: boolean;
  className: string;
  axis: "x" | "y";
}) {
  return (
    <m.span
      aria-hidden
      className={`pointer-events-none absolute bg-elektryk ${className}`}
      initial={false}
      animate={{
        scaleX: axis === "x" ? (on ? 1 : 0) : 1,
        scaleY: axis === "y" ? (on ? 1 : 0) : 1,
        opacity: on ? 1 : 0,
      }}
      transition={SEQUENCE_STEP}
    />
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-center justify-between font-mono text-[9px] tracking-wider text-paper/35 uppercase">
      {children}
    </div>
  );
}

function FieldBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-1 rounded-md bg-[#0f1116] px-2 py-1.5 text-[11px] text-paper/80">
      {children}
    </div>
  );
}

export function HeroChassis(props: ChassisProps) {
  const { ref, stage, reduced } = useBeatClock<HTMLDivElement>();

  const typedPrompt = useTyped(
    props.chatPrompt,
    stage === Stage.TYPING,
    reduced || stage > Stage.TYPING,
    1100,
  );
  const typedValue = useTyped(
    props.dockLabel,
    stage === Stage.INSPECTOR,
    reduced || stage > Stage.INSPECTOR,
    420,
  );

  const dirty = stage >= Stage.DRAFT && stage < Stage.PUBLISHED;
  const done = stage >= Stage.PUBLISHED;
  const docked = stage >= Stage.DOCK;
  const inspecting = stage >= Stage.INSPECTOR;
  const coded = stage >= Stage.SIGNAL_CODE;

  return (
    <div ref={ref} className="@container">
      <div className="overflow-hidden rounded-2xl border border-paper/10 bg-[#14161b] shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 border-b border-paper/10 px-4 py-2.5">
          <span className="grid size-6 place-items-center rounded-md bg-card">
            <CmssyMark className="h-3 w-auto text-foreground" />
          </span>
          {props.title ? (
            <span className="truncate font-mono text-[12px] text-paper/70">
              {props.title}
            </span>
          ) : null}
          <m.span
            className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] ${
              dirty
                ? "bg-amber-400/15 text-amber-300"
                : "bg-emerald-500/15 text-emerald-400"
            }`}
            animate={{ scale: 1 }}
            initial={false}
            transition={RESPONSE}
          >
            <span
              className={`size-1 rounded-full ${dirty ? "bg-amber-300" : "bg-emerald-400"}`}
            />
            {dirty ? props.badgeDraft : props.badge}
          </m.span>
          <span className="mx-auto hidden items-center gap-1 rounded-md bg-background/6 p-0.5 @2xl:flex">
            <span className="rounded bg-background/12 p-1">
              <Monitor className="size-3 text-paper/80" />
            </span>
            <span className="p-1">
              <Tablet className="size-3 text-paper/35" />
            </span>
            <span className="p-1">
              <Smartphone className="size-3 text-paper/35" />
            </span>
          </span>
          <span className="ml-auto flex items-center gap-2.5 @2xl:ml-0">
            <Undo2 className="hidden size-3 text-paper/35 @xl:block" />
            <Redo2 className="hidden size-3 text-paper/35 @xl:block" />
            {props.meta ? (
              <span className="hidden items-center gap-1 font-mono text-[11px] text-paper/40 @xl:flex">
                <Globe className="size-3" />
                {props.meta}
              </span>
            ) : null}
            <span className="grid size-6 place-items-center rounded-full bg-elektryk/20 font-mono text-[9px] text-elektryk">
              AD
            </span>
          </span>
        </div>

        <div className="flex">
          <div className="hidden w-9 shrink-0 flex-col items-center gap-3 border-r border-paper/10 py-3 @xl:flex">
            <Home className="size-3.5 text-paper/35" />
            <FileText className="size-3.5 text-elektryk" />
            <ImageIcon className="size-3.5 text-paper/35" />
            <Boxes className="size-3.5 text-paper/35" />
            <Users className="size-3.5 text-paper/35" />
          </div>

          {props.pages.length > 0 ? (
            <div className="hidden w-40 shrink-0 border-r border-paper/10 p-3 @4xl:block">
              <div className="flex items-center gap-1 rounded-md bg-background/6 p-0.5 font-mono text-[10px]">
                <span className="rounded bg-background/12 px-1.5 py-0.5 text-paper/90">
                  Pages
                </span>
                <span className="px-1.5 py-0.5 text-paper/40">Layers</span>
                <span className="px-1.5 py-0.5 text-paper/40">Blocks</span>
              </div>
              <ul className="mt-3 space-y-0.5 text-[12px]">
                {props.pages.map((p, i) => (
                  <li
                    key={p.name}
                    className={
                      i === 0
                        ? "flex items-center gap-1.5 rounded bg-elektryk/15 px-2 py-1 font-medium text-elektryk"
                        : "flex items-center justify-between gap-1.5 px-2 py-1 text-paper/55"
                    }
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="size-3 shrink-0 opacity-60" />
                      {p.name}
                    </span>
                    {i > 0 && p.tag ? (
                      <span className="rounded bg-background/10 px-1 font-mono text-[9px] text-paper/45">
                        {p.tag}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="dot-grid-light relative flex min-h-[clamp(19rem,34vw,24rem)] flex-1 flex-col bg-background p-4">
            <Signal
              on={stage >= Stage.SIGNAL_CANVAS && stage < Stage.SIGNAL_CODE}
              axis="y"
              className="bottom-0 left-0 w-[2px] origin-bottom"
              key="signal-canvas"
            />

            <div className="flex h-8 items-center justify-between rounded-md border border-border bg-card px-2">
              <span className="h-2.5 w-14 rounded bg-muted" />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-8 rounded bg-muted" />
                <span className="h-2 w-8 rounded bg-muted" />
                <span className="h-4 w-12 rounded bg-elektryk" />
              </span>
            </div>

            <div className="relative mt-2 rounded-md border-2 border-elektryk/70 bg-card px-3 py-2.5">
              <span className="absolute -top-2 left-2 rounded-sm bg-elektryk px-1 font-mono text-[8px] text-ink">
                Heading
              </span>
              <span className="absolute -top-1 -left-1 size-1.5 border border-elektryk bg-card" />
              <span className="absolute -top-1 -right-1 size-1.5 border border-elektryk bg-card" />
              <span className="absolute -bottom-1 -left-1 size-1.5 border border-elektryk bg-card" />
              <span className="absolute -right-1 -bottom-1 size-1.5 border border-elektryk bg-card" />
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="mt-1.5 h-3 w-1/2 rounded bg-muted" />
            </div>

            <div
              className="mt-2 grid h-16 place-items-center rounded-md border border-border"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(16,20,28,.06) 0 6px, transparent 6px 12px)",
              }}
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                product shot
              </span>
            </div>

            <AnimatePresence initial={false}>
              {docked && props.dockLabel ? (
                <m.div
                  key="dock"
                  className="mt-2 mb-3 flex items-center gap-2.5 rounded-md bg-elektryk px-3 py-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={SETTLE}
                >
                  {props.dockTag ? (
                    <span className="grid size-6 shrink-0 place-items-center rounded bg-muted font-mono text-[9px] font-semibold text-foreground">
                      {props.dockTag}
                    </span>
                  ) : null}
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[11px] font-semibold text-foreground">
                      {props.dockLabel}
                    </span>
                    {props.dockSub ? (
                      <span className="block truncate font-mono text-[9px] text-ink/65">
                        {props.dockSub}
                      </span>
                    ) : null}
                  </span>
                </m.div>
              ) : null}
            </AnimatePresence>

            {props.chatPrompt || props.chatStatus ? (
              <div className="mt-auto rounded-lg bg-ink p-3 shadow-xl">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-card">
                    <CmssyMark className="h-3 w-auto text-foreground" />
                  </span>
                  <span className="min-w-0 leading-snug">
                    <span className="block truncate font-mono text-[11px] text-paper/90">
                      {typedPrompt}
                      {!reduced && stage === Stage.TYPING ? (
                        <span className="ml-px inline-block h-[1em] w-[0.45em] translate-y-[0.15em] bg-elektryk" />
                      ) : null}
                    </span>
                    <AnimatePresence initial={false}>
                      {done && props.chatStatus ? (
                        <m.span
                          key="status"
                          className="mt-0.5 block truncate font-mono text-[10px] text-paper/45"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={RESPONSE}
                        >
                          {props.chatStatus}
                        </m.span>
                      ) : null}
                    </AnimatePresence>
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {stage >= Stage.TOOLS ? (
                    <m.div
                      key="tools"
                      className="mt-2 hidden flex-col gap-1 border-t border-paper/10 pt-2 @xl:flex"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={RESPONSE}
                    >
                      {props.toolCalls.map((call, i) => (
                        <m.span
                          key={call}
                          className="flex items-center gap-1.5 font-mono text-[10px] text-paper/55"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...SEQUENCE_STEP, delay: i * 0.22 }}
                        >
                          <span className="text-emerald-400">✓</span>
                          <span className="truncate">{call}</span>
                        </m.span>
                      ))}
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </div>

          <div className="hidden w-44 shrink-0 border-l border-paper/10 p-3 @2xl:block">
            <div className="truncate text-[12px] font-semibold text-paper/90">
              {inspecting ? props.dockLabel : props.inspectorTitle}
            </div>
            {props.inspectorSubtitle ? (
              <div className="mt-0.5 truncate text-[10px] text-paper/40">
                {props.inspectorSubtitle}
              </div>
            ) : null}
            <div className="mt-2.5 flex gap-3 border-b border-paper/10 font-mono text-[10px]">
              <span className="border-b border-elektryk pb-1 text-paper/90">
                Content
              </span>
              <span className="pb-1 text-paper/40">Style</span>
              <span className="pb-1 text-paper/40">Advanced</span>
            </div>

            {inspecting ? (
              <m.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={SETTLE}
              >
                <FieldLabel>Heading</FieldLabel>
                <FieldBox>
                  <span className="truncate">{typedValue}</span>
                  {!reduced && stage === Stage.INSPECTOR ? (
                    <span className="ml-px inline-block h-[1em] w-[0.4em] translate-y-[0.15em] bg-elektryk" />
                  ) : null}
                </FieldBox>
                <FieldLabel>Description</FieldLabel>
                <FieldBox>
                  <span className="block h-2 w-4/5 rounded bg-paper/15" />
                </FieldBox>
                <FieldLabel>
                  Features
                  <span className="normal-case">3 items</span>
                </FieldLabel>
                <FieldBox>
                  <span className="flex items-center gap-1.5">
                    <span className="text-paper/30">⋮⋮</span> Feature 1
                  </span>
                </FieldBox>
              </m.div>
            ) : (
              <div>
                <FieldLabel>Logo Text</FieldLabel>
                <FieldBox>cmssy</FieldBox>
                <FieldLabel>
                  Navigation Items
                  <span className="normal-case">5 items</span>
                </FieldLabel>
                <FieldBox>
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="text-paper/30">⋮⋮</span> Product
                    </span>
                    <span className="text-paper/30">⌃⌄</span>
                  </span>
                </FieldBox>
                <FieldLabel>Dropdown Columns</FieldLabel>
                <div className="mt-1 flex gap-1 rounded-md bg-[#0f1116] p-1 text-center font-mono text-[10px]">
                  <span className="flex-1 py-0.5 text-paper/40">none</span>
                  <span className="flex-1 py-0.5 text-paper/40">1</span>
                  <span className="flex-1 py-0.5 text-paper/40">2</span>
                  <span className="flex-1 rounded bg-elektryk py-0.5 font-semibold text-ink">
                    3
                  </span>
                </div>
              </div>
            )}

            {props.inspectorFooter ? (
              <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-paper/40">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                {props.inspectorFooter}
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative flex items-center gap-3 border-t border-paper/10 px-4 py-2">
          <Signal
            on={coded}
            axis="x"
            className="top-0 left-0 h-[2px] w-full origin-left"
            key="signal-code"
          />
          <span className="hidden truncate font-mono text-[10px] text-paper/35 @xl:inline">
            {props.codeLine}
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[10px]">
            <span className="text-paper/30">{props.codeDataLabel}</span>
            <m.span
              className="rounded bg-elektryk/15 px-1.5 py-0.5 text-elektryk"
              initial={false}
              animate={{ opacity: coded ? 1 : 0, y: coded ? 0 : 6 }}
              transition={SETTLE}
            >
              + features
            </m.span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-paper/40">
        <span className="inline-block size-1.5 shrink-0 rounded-[2px] bg-elektryk" />
        <m.span
          key={done ? "done" : "base"}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SETTLE}
        >
          {done ? props.captionDone : props.caption}
        </m.span>
      </div>
    </div>
  );
}
