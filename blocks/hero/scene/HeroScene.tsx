"use client";

import { ArrowUp, Check, ChevronLeft, Zap } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { SceneLabels, SceneTarget } from "./types";

type Spot =
  | "headline"
  | "button"
  | "visual"
  | "spec"
  | "apiTab"
  | "previewTab";
type CursorSpot = "off" | "rest" | Spot;

type Message =
  | { id: number; kind: "user"; text: string }
  | { id: number; kind: "thinking" }
  | { id: number; kind: "tool"; text: string; done: boolean }
  | { id: number; kind: "reply"; text: string };

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface NewField {
  name: string;
  value: string;
}

const TYPE_MS = 38;
const DELETE_MS = 16;
const SWAP_MS = 700;
const FADE_MS = 800;

const SPOTS: Spot[] = [
  "headline",
  "button",
  "visual",
  "spec",
  "apiTab",
  "previewTab",
];

const CLICK_SPOT: Partial<Record<SceneTarget, Spot>> = {
  headline: "headline",
  button: "button",
  accent: "button",
  layout: "visual",
  api: "apiTab",
};

function boxIn(el: HTMLElement, root: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export function HeroScene({ labels }: { labels: SceneLabels }) {
  const { steps } = labels;

  const [headline, setHeadline] = useState(labels.siteHeadline);
  const [button, setButton] = useState(labels.siteButton);
  const [accent, setAccent] = useState<string | null>(null);
  const [swapped, setSwapped] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [draftField, setDraftField] = useState("");
  const [field, setField] = useState<NewField | null>(null);
  const [apiView, setApiView] = useState(false);
  const [composer, setComposer] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<CursorSpot>("off");
  const [pressed, setPressed] = useState(false);
  const [selected, setSelected] = useState<Spot | null>(null);
  const [editing, setEditing] = useState(false);
  const [fading, setFading] = useState(false);
  const [boxes, setBoxes] = useState<Partial<Record<Spot, Box>>>({});
  const [siteSize, setSiteSize] = useState({ w: 0, h: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const spotRefs = useRef<Partial<Record<Spot, HTMLElement | null>>>({});
  const visibleRef = useRef(true);

  const spotRef = (spot: Spot) => (el: HTMLElement | null) => {
    spotRefs.current[spot] = el;
  };

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useLayoutEffect(() => {
    const site = siteRef.current;
    if (!site) return;
    const measure = () => {
      const next: Partial<Record<Spot, Box>> = {};
      for (const spot of SPOTS) {
        const el = spotRefs.current[spot];
        if (el) next[spot] = boxIn(el, site);
      }
      setBoxes(next);
      setSiteSize({ w: site.offsetWidth, h: site.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(site);
    for (const spot of SPOTS) {
      const el = spotRefs.current[spot];
      if (el) ro.observe(el);
    }
    return () => ro.disconnect();
  }, [swapped, field]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const swapLayout = (next: boolean) => {
      const els = [copyRef.current, visualRef.current].filter(
        (e): e is HTMLDivElement => Boolean(e),
      );
      const before = els.map((e) => e.getBoundingClientRect());
      flushSync(() => setSwapped(next));
      els.forEach((el, i) => {
        const after = el.getBoundingClientRect();
        el.animate(
          [
            {
              transform: `translate(${before[i].left - after.left}px, ${before[i].top - after.top}px)`,
            },
            { transform: "translate(0, 0)" },
          ],
          { duration: SWAP_MS, easing: "cubic-bezier(0.65, 0, 0.25, 1)" },
        );
      });
    };

    const resetScene = () => {
      setHeadline(labels.siteHeadline);
      setButton(labels.siteButton);
      setAccent(null);
      setSwapped(false);
      setModelOpen(false);
      setDraftField("");
      setField(null);
      setApiView(false);
      setMessages([]);
      setComposer("");
      setSelected(null);
      setEditing(false);
    };

    resetScene();
    setCursor("off");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const first = steps[0];
      if (first.target === "headline") setHeadline(first.text);
      if (first.target === "button") setButton(first.text);
      if (first.target === "accent") setAccent(first.text);
      if (first.target === "layout") setSwapped(true);
      if (first.target === "model")
        setField({ name: first.text, value: first.detail });
      setMessages([
        { id: 1, kind: "user", text: first.prompt },
        ...first.tools.map((t, i) => ({
          id: 2 + i,
          kind: "tool" as const,
          text: t,
          done: true,
        })),
        ...(first.reply
          ? [{ id: 99, kind: "reply" as const, text: first.reply }]
          : []),
      ]);
      return;
    }

    let cancelled = false;
    let nextId = 0;

    const sleep = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const tick = () => {
          if (cancelled) return reject(new Error("cancelled"));
          if (!visibleRef.current || document.hidden) {
            setTimeout(tick, 250);
            return;
          }
          setTimeout(
            () => (cancelled ? reject(new Error("cancelled")) : resolve()),
            ms,
          );
        };
        tick();
      });

    const push = (m: Message) => setMessages((prev) => [...prev, m]);

    const click = async (spot: Spot) => {
      setCursor(spot);
      await sleep(950);
      setPressed(true);
      await sleep(140);
      setPressed(false);
    };

    const typeInto = async (write: (v: string) => void, to: string) => {
      for (let i = 1; i <= to.length; i++) {
        write(to.slice(0, i));
        await sleep(TYPE_MS);
      }
    };

    const rewrite = async (
      write: (v: string) => void,
      from: string,
      to: string,
    ) => {
      setEditing(true);
      for (let i = from.length - 1; i >= 0; i--) {
        write(from.slice(0, i));
        await sleep(DELETE_MS);
      }
      await sleep(180);
      await typeInto(write, to);
      setEditing(false);
    };

    const run = async () => {
      let text = { headline: labels.siteHeadline, button: labels.siteButton };
      let isSwapped = false;
      await sleep(900);

      for (;;) {
        for (const step of steps) {
          await typeInto(setComposer, step.prompt);
          await sleep(350);
          setComposer("");
          push({ id: ++nextId, kind: "user", text: step.prompt });

          await sleep(400);
          let toolId = ++nextId;
          push({ id: toolId, kind: "thinking" });
          await sleep(1100);

          const tools = step.tools.length > 0 ? step.tools : [""];
          const markDone = (id: number) =>
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id && m.kind === "tool" ? { ...m, done: true } : m,
              ),
            );
          const startTool = (id: number, label: string) =>
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id
                  ? { id, kind: "tool", text: label, done: false }
                  : m,
              ),
            );
          const nextTool = async (label: string) => {
            markDone(toolId);
            await sleep(250);
            toolId = ++nextId;
            push({ id: toolId, kind: "tool", text: label, done: false });
          };

          const spot = CLICK_SPOT[step.target];
          if (spot) {
            await click(spot);
            setSelected(spot);
          }
          startTool(toolId, tools[0]);
          await sleep(450);

          if (step.target === "headline") {
            await rewrite(setHeadline, text.headline, step.text);
            text = { ...text, headline: step.text };
          } else if (step.target === "button") {
            await rewrite(setButton, text.button, step.text);
            text = { ...text, button: step.text };
          } else if (step.target === "accent") {
            setAccent(step.text);
            await sleep(900);
          } else if (step.target === "layout") {
            setSelected(null);
            isSwapped = !isSwapped;
            swapLayout(isSwapped);
            await sleep(SWAP_MS + 50);
            setSelected("visual");
            await sleep(300);
          } else if (step.target === "model") {
            setModelOpen(true);
            await sleep(600);
            await typeInto(setDraftField, step.text);
            await sleep(500);
            for (const label of tools.slice(1)) await nextTool(label);
            await sleep(500);
            setField({ name: step.text, value: step.detail });
            await sleep(120);
            setCursor("spec");
            await sleep(700);
            setSelected("spec");
            await sleep(900);
          } else if (step.target === "api") {
            setSelected(null);
            setApiView(true);
            await sleep(3200);
            await click("previewTab");
            setApiView(false);
            await sleep(400);
          }

          if (step.target !== "model")
            for (const label of tools.slice(1)) await nextTool(label);

          await sleep(300);
          markDone(toolId);
          await sleep(250);
          if (step.reply)
            push({ id: ++nextId, kind: "reply", text: step.reply });

          await sleep(500);
          setSelected(null);
          setCursor("rest");
          if (step.target === "model") {
            await sleep(900);
            setModelOpen(false);
            await sleep(1100);
          } else {
            await sleep(2000);
          }
        }

        setFading(true);
        setCursor("off");
        await sleep(FADE_MS + 150);
        resetScene();
        text = { headline: labels.siteHeadline, button: labels.siteButton };
        isSwapped = false;
        await sleep(300);
        setFading(false);
        await sleep(FADE_MS + 400);
      }
    };

    run().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [steps, labels.siteHeadline, labels.siteButton]);

  const cursorPos = (() => {
    if (cursor === "off") return { x: siteSize.w * 0.92, y: siteSize.h * 1.05 };
    if (cursor === "rest") return { x: siteSize.w * 0.62, y: siteSize.h * 0.86 };
    const b = boxes[cursor];
    if (!b) return { x: siteSize.w * 0.62, y: siteSize.h * 0.86 };
    return {
      x: b.x + Math.min(b.w * 0.6, b.w - 12),
      y: b.y + b.h * 0.62,
    };
  })();

  const selBox = selected ? boxes[selected] : null;

  const json = [
    { key: "name", value: JSON.stringify(labels.productName) },
    { key: "price", value: JSON.stringify(labels.productPrice) },
    ...(accent ? [{ key: "color", value: JSON.stringify(accent) }] : []),
    ...(field
      ? [{ key: field.name, value: JSON.stringify(field.value), fresh: true }]
      : []),
  ];

  return (
    <div ref={rootRef} className="hero-scene" aria-hidden="true">
      <div className="hero-scene__stage">
        <div
          ref={siteRef}
          className="hero-scene__site"
          style={
            accent
              ? ({ "--scene-accent": accent } as React.CSSProperties)
              : undefined
          }
        >
          <div className="hero-scene__chrome">
            <span />
            <span />
            <span />
            <div className="hero-scene__tabs">
              <span
                ref={spotRef("previewTab")}
                data-active={apiView ? undefined : ""}
              >
                Preview
              </span>
              <span ref={spotRef("apiTab")} data-active={apiView ? "" : undefined}>
                API
              </span>
            </div>
            <div className="hero-scene__url">{labels.siteDomain}</div>
          </div>

          <div
            className="hero-scene__page"
            data-fading={fading ? "" : undefined}
            data-hidden={apiView ? "" : undefined}
          >
            <div className="hero-scene__nav">
              <span className="hero-scene__brand">{labels.siteBrand}</span>
              <span className="hero-scene__links">
                {labels.siteNav.map((n, i) => (
                  <span key={`${i}-${n}`}>{n}</span>
                ))}
              </span>
            </div>

            <div
              className="hero-scene__body"
              data-swapped={swapped ? "" : undefined}
            >
              <div ref={copyRef} className="hero-scene__copy">
                <div className="hero-scene__headline">
                  <span ref={spotRef("headline")}>
                    {headline || " "}
                    {editing && selected === "headline" ? (
                      <i className="hero-scene__caret" />
                    ) : null}
                  </span>
                </div>
                <div className="hero-scene__lines">
                  <span />
                  <span />
                </div>
                <div className="hero-scene__actions">
                  <span ref={spotRef("button")} className="hero-scene__btn">
                    {button || " "}
                    {editing && selected === "button" ? (
                      <i className="hero-scene__caret" />
                    ) : null}
                  </span>
                  {field ? (
                    <span ref={spotRef("spec")} className="hero-scene__spec">
                      <Zap size={12} strokeWidth={2.5} />
                      {field.value}
                    </span>
                  ) : null}
                </div>
              </div>
              <div ref={visualRef} className="hero-scene__visual">
                <span className="hero-scene__halo">
                  <span className="hero-scene__ripple" />
                  <span className="hero-scene__ripple" />
                  <span className="hero-scene__ripple" />
                  <span className="hero-scene__ripple" />
                  <span className="hero-scene__drop" />
                </span>
                <svg
                  className="hero-scene__product"
                  viewBox="0 0 200 180"
                  fill="none"
                >
                  <path
                    className="hero-scene__band"
                    d="M46 112V92a54 54 0 0 1 108 0v20"
                  />
                  <path
                    className="hero-scene__band-inner"
                    d="M56 96a44 44 0 0 1 88 0"
                  />
                  <rect className="hero-scene__cup" x="28" y="98" width="38" height="62" rx="17" />
                  <rect className="hero-scene__cup" x="134" y="98" width="38" height="62" rx="17" />
                  <rect className="hero-scene__pad" x="58" y="106" width="10" height="46" rx="5" />
                  <rect className="hero-scene__pad" x="132" y="106" width="10" height="46" rx="5" />
                  <rect className="hero-scene__shine" x="34" y="104" width="8" height="26" rx="4" />
                  <rect className="hero-scene__shine" x="140" y="104" width="8" height="26" rx="4" />
                </svg>
                <div className="hero-scene__meta">
                  <span>
                    <b>{labels.productName}</b>
                    <small>{labels.productPrice}</small>
                  </span>
                  <span className="hero-scene__swatches">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="hero-scene__api"
            data-open={apiView ? "" : undefined}
          >
            <div className="hero-scene__api-head">
              <span>POST</span> /graphql
              <span className="hero-scene__api-status">200 OK</span>
            </div>
            <pre>
              <span className="hero-scene__j-p">{"{"}</span>
              {"\n"}
              {"  "}
              <span className="hero-scene__j-k">&quot;{labels.modelName.toLowerCase()}&quot;</span>
              <span className="hero-scene__j-p">: {"{"}</span>
              {json.map((row, i) => (
                <span
                  key={row.key}
                  className="hero-scene__j-row"
                  data-fresh={"fresh" in row ? "" : undefined}
                >
                  {"\n    "}
                  <span className="hero-scene__j-k">&quot;{row.key}&quot;</span>
                  <span className="hero-scene__j-p">: </span>
                  <span className="hero-scene__j-v">{row.value}</span>
                  {i < json.length - 1 ? (
                    <span className="hero-scene__j-p">,</span>
                  ) : null}
                </span>
              ))}
              {"\n  "}
              <span className="hero-scene__j-p">{"}"}</span>
              {"\n"}
              <span className="hero-scene__j-p">{"}"}</span>
            </pre>
          </div>

          <div
            className="hero-scene__model"
            data-open={modelOpen ? "" : undefined}
          >
            <div className="hero-scene__model-head">
              <span>Model</span>
              <b>{labels.modelName}</b>
            </div>
            {labels.modelFields.map((f) => (
              <div key={f.name} className="hero-scene__model-row">
                <span>{f.name}</span>
                <small>{f.type}</small>
              </div>
            ))}
            {draftField ? (
              <div className="hero-scene__model-row" data-new="">
                <span>
                  + {draftField}
                  {field ? null : <i className="hero-scene__caret" />}
                </span>
                <small>Text</small>
              </div>
            ) : null}
          </div>

          {selBox ? (
            <div
              className="hero-scene__select"
              style={{
                transform: `translate(${selBox.x - 6}px, ${selBox.y - 4}px)`,
                width: selBox.w + 12,
                height: selBox.h + 8,
              }}
            >
              <i />
              <i />
              <i />
              <i />
            </div>
          ) : null}

          <div
            className="hero-scene__cursor"
            data-hidden={cursor === "off" ? "" : undefined}
            data-pressed={pressed ? "" : undefined}
            style={{
              transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
            }}
          >
            <svg viewBox="0 0 20 22" width="20" height="22">
              <path
                d="M2 1.5 18 9.6l-7 1.9-3.2 6.9L2 1.5Z"
                fill="currentColor"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            <span>{labels.agentName}</span>
          </div>
        </div>

        <div className="hero-scene__phone">
          <div className="hero-scene__status">
            <span>9:41</span>
            <span className="hero-scene__island" />
            <span className="hero-scene__bars">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="hero-scene__chathead">
            <ChevronLeft size={16} strokeWidth={2} />
            <span>{labels.chatTitle}</span>
            <span className="hero-scene__avatar" />
          </div>

          <div
            ref={threadRef}
            className="hero-scene__thread"
            data-fading={fading ? "" : undefined}
          >
            {messages.map((m) => {
              if (m.kind === "user")
                return (
                  <div key={m.id} className="hero-scene__bubble">
                    {m.text}
                  </div>
                );
              if (m.kind === "thinking")
                return (
                  <div key={m.id} className="hero-scene__thinking">
                    {labels.thinkingLabel}…
                  </div>
                );
              if (m.kind === "tool")
                return (
                  <div
                    key={m.id}
                    className="hero-scene__tool"
                    data-done={m.done ? "" : undefined}
                  >
                    {m.done ? (
                      <Check size={12} strokeWidth={2.5} />
                    ) : (
                      <span className="hero-scene__spinner" />
                    )}
                    <span>{m.text}</span>
                  </div>
                );
              return (
                <div key={m.id} className="hero-scene__reply">
                  {m.text}
                </div>
              );
            })}
          </div>

          <div className="hero-scene__composer">
            <span className="hero-scene__input">
              {composer ? (
                <>
                  {composer}
                  <i className="hero-scene__caret" />
                </>
              ) : (
                <span className="hero-scene__placeholder">
                  {labels.composerPlaceholder}
                </span>
              )}
            </span>
            <span
              className="hero-scene__send"
              data-active={composer ? "" : undefined}
            >
              <ArrowUp size={13} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
