"use client";

import { m, useTransform } from "motion/react";
import { RESPONSE, SETTLE } from "@/components/motion/presets";
import { Substrate } from "./Substrate";
import {
  DIM,
  EL,
  EL3,
  FAINT,
  LABEL,
  LitPath,
  RollingNumber,
  TransportDefs,
} from "./parts";
import {
  F_A,
  F_C,
  F_D,
  RUN_ANGLE,
  TERM,
  TRACKS,
  TRACK_OFFSETS,
  WORLD,
  X_BUS,
  X_GATE,
  X_MCP,
  X_BLK,
  X_TERM,
  axisY,
  busPath,
  trackXAt,
  trackYAt,
  trunkPath,
  xAt,
} from "./geometry";
import type { Sequence, StationKey } from "./useTransportSequence";
import type { TransportLabels } from "./labels";

const TRUNK_LEN = Math.hypot(F_A - WORLD.left, axisY(F_A) - axisY(WORLD.left));
const BUS_LEN = Math.hypot(X_TERM - F_D, axisY(X_TERM) - axisY(F_D));

const GATE_Y = axisY(X_GATE);
/** the gate sits square to the run, which is no longer horizontal */
const GATE_TILT = `rotate(${RUN_ANGLE.toFixed(2)} ${X_GATE} ${GATE_Y})`;
/** the publish annotation hangs below the climbing route, not above it */
const PUB_LEAD = GATE_Y + 42;
const PUB_LABEL = PUB_LEAD + 62;

/** the fan annotation rides above the topmost track, mid-plateau */
const FAN_X = 616;
const FAN_TOP = trackYAt(FAN_X, TRACK_OFFSETS[0]);

const RAIL_WIDTHS = [0.5, 0.82, 0.36, 0.62];
const WRITTEN_RAIL = 1;

interface Props {
  seq: Sequence;
  reduced: boolean;
  coarse: boolean;
  labels: TransportLabels;
}

export function TransportDesktop({ seq, reduced, coarse, labels }: Props) {
  const { progress, streak, wave, settle, stage, scrubTo, scrubbing } = seq;

  const inletOn = stage >= 1;
  const docked = stage >= 2;
  const fanning = stage >= 3;
  const gateOpen = stage >= 4;
  const landed = stage >= 5;

  const payX = useTransform(progress, (p) => Math.min(xAt(p), X_TERM));
  const payY = useTransform(payX, (x) => axisY(x));
  const trunkVisible = useTransform(progress, (p) =>
    xAt(p) <= F_A + 4 || xAt(p) >= F_D - 4 ? 1 : 0,
  );

  /* the ripple stays inside the diagram band: a pressure release at the gate,
     not a circle drawn across the page */
  const waveR = useTransform(wave, [0, 1], [10, 224]);
  const waveO = useTransform(wave, [0, 0.12, 0.62, 1], [0, 0.5, 0.16, 0]);
  const waveR2 = useTransform(wave, [0, 1], [10, 268]);
  const waveO2 = useTransform(wave, [0, 0.18, 0.7, 1], [0, 0.17, 0.06, 0]);
  const busO = useTransform(settle, [0, 1], [1, 0.42]);

  const station = (key: StationKey) => ({
    tabIndex: 0,
    role: "button" as const,
    "aria-label": labels.stationAria[key],
    className: "tp-hit",
    onPointerEnter: () => scrubTo(key),
    onPointerLeave: () => scrubTo(null),
    onFocus: () => scrubTo(key),
    onBlur: () => scrubTo(null),
  });

  const hot = (key: StationKey, base: string, on: string) =>
    scrubbing === key ? EL3 : base === on ? on : base;

  return (
    <>
      <TransportDefs />

      <Substrate
        progress={progress}
        wave={wave}
        ambient={seq.ambient}
        reduced={reduced}
        coarse={coarse}
      />

      {/* ---------------------------------------------------- dormant bed */}
      <g aria-hidden>
        <path d={trunkPath()} fill="none" stroke={FAINT} strokeWidth={1.5} />
        {TRACKS.map((t) => (
          <path
            key={t.offset}
            d={t.d}
            fill="none"
            stroke={FAINT}
            strokeWidth={1.5}
          />
        ))}
        <path d={busPath()} fill="none" stroke={FAINT} strokeWidth={1.5} />
      </g>

      {/* ------------------------------------------------------- lit runs */}
      <LitPath
        d={trunkPath()}
        worldLength={TRUNK_LEN}
        sOf={(p) =>
          Math.min(1, (Math.min(xAt(p), F_A) - WORLD.left) / TRUNK_LEN)
        }
        progress={progress}
        streak={streak}
        settle={settle}
        rest={0.3}
      />
      {TRACKS.map((t, i) => (
        <LitPath
          key={t.offset}
          d={t.d}
          worldLength={t.length}
          sOf={(p) => t.s(trackXAt(xAt(p), i))}
          progress={progress}
          streak={streak}
          settle={settle}
          rest={0.24}
        />
      ))}
      <LitPath
        d={busPath()}
        worldLength={BUS_LEN}
        sOf={(p) => Math.max(0, (xAt(p) - F_D) / BUS_LEN)}
        progress={progress}
        streak={streak}
        settle={settle}
        rest={0.42}
      />

      {/* -------------------------------------------------- publish wave */}
      <m.circle
        cx={X_GATE}
        cy={axisY(X_GATE)}
        r={waveR}
        fill="none"
        stroke={EL}
        strokeWidth={2}
        style={{ opacity: waveO }}
        aria-hidden
      />
      <m.circle
        cx={X_GATE}
        cy={axisY(X_GATE)}
        r={waveR2}
        fill="none"
        stroke={EL}
        strokeWidth={1.5}
        style={{ opacity: waveO2 }}
        aria-hidden
      />

      {/* ------------------------------------------------------ MCP inlet */}
      <g {...station("mcp")}>
        <rect
          x={X_MCP - 46}
          y={axisY(X_MCP) - 34}
          width={92}
          height={68}
          rx={10}
          fill="transparent"
        />
        <m.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ scaleY: inletOn ? 0.55 : 1 }}
          transition={RESPONSE}
        >
          <path
            d={`M${X_MCP - 26},${axisY(X_MCP) - 11} L${X_MCP - 13},${axisY(X_MCP)} L${X_MCP - 26},${axisY(X_MCP) + 11}`}
            fill="none"
            stroke={inletOn ? hot("mcp", EL3, EL3) : FAINT}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </m.g>
        <circle
          cx={X_MCP}
          cy={axisY(X_MCP)}
          r={6.5}
          fill={inletOn ? EL : "#10141c"}
          stroke={inletOn ? EL : FAINT}
          strokeWidth={1.5}
        />
        <line
          x1={X_MCP}
          y1={axisY(X_MCP) + 14}
          x2={X_MCP}
          y2={axisY(X_MCP) + 52}
          stroke={inletOn ? "rgba(0,168,240,.45)" : "rgba(250,250,248,.06)"}
          strokeWidth={1}
        />
        <text
          x={X_MCP - 14}
          y={axisY(X_MCP) + 72}
          className="tp-label"
          fill={inletOn ? EL3 : LABEL}
        >
          {labels.mcp}
        </text>
        <m.text
          x={X_MCP - 14}
          y={axisY(X_MCP) + 90}
          className="tp-sub"
          fill={DIM}
          animate={{ opacity: inletOn ? 1 : 0 }}
          transition={RESPONSE}
        >
          {labels.mcpTool}
        </m.text>
      </g>

      {/* ---------------------------------------------------------- block */}
      <g {...station("block")}>
        <rect
          x={X_BLK - 52}
          y={axisY(X_BLK) - 46}
          width={104}
          height={92}
          rx={12}
          fill="transparent"
        />
        <m.g animate={{ y: docked ? 2 : 0 }} transition={SETTLE}>
          <rect
            x={X_BLK - 38}
            y={axisY(X_BLK) - 34}
            width={76}
            height={68}
            rx={8}
            fill="#0d1119"
            stroke={docked ? "rgba(0,168,240,.6)" : FAINT}
            strokeWidth={1.5}
            filter={docked ? "url(#tp-lift)" : undefined}
          />
          {RAIL_WIDTHS.map((w, i) => (
            <m.rect
              key={i}
              x={X_BLK - 26}
              y={axisY(X_BLK) - 20 + i * 12}
              width={Math.round(52 * w)}
              height={4.5}
              rx={1.5}
              fill="rgba(250,250,248,.22)"
              initial={{ fill: "rgba(250,250,248,.22)" }}
              animate={{
                fill: docked
                  ? i === WRITTEN_RAIL
                    ? EL
                    : "rgba(250,250,248,.13)"
                  : "rgba(250,250,248,.22)",
              }}
              transition={SETTLE}
            />
          ))}
        </m.g>
        <polyline
          points={`${X_BLK},${axisY(X_BLK) + 34} ${X_BLK},${axisY(X_BLK) + 100} ${X_BLK + 30},${axisY(X_BLK) + 100}`}
          fill="none"
          stroke={docked ? "rgba(0,168,240,.45)" : "rgba(250,250,248,.06)"}
          strokeWidth={1}
        />
        <text
          x={X_BLK + 40}
          y={axisY(X_BLK) + 104}
          className="tp-label"
          fill={docked ? EL3 : LABEL}
        >
          {labels.block}
        </text>
        <m.text
          x={X_BLK + 40}
          y={axisY(X_BLK) + 122}
          className="tp-sub"
          fill={DIM}
          animate={{ opacity: docked ? 1 : 0 }}
          transition={RESPONSE}
        >
          {labels.blockFields}
        </m.text>
      </g>

      {/* ------------------------------------------------------------ fan */}
      <g {...station("fan")}>
        <rect
          x={F_A - 20}
          y={FAN_TOP - 40}
          width={F_D - F_A + 80}
          height={axisY(F_A) - FAN_TOP + 70}
          rx={16}
          fill="transparent"
        />
        <m.circle
          cx={F_A}
          cy={axisY(F_A)}
          fill={fanning ? EL : "#10141c"}
          stroke={fanning ? EL : FAINT}
          strokeWidth={1.5}
          r={4.5}
          initial={{ r: 4.5 }}
          animate={{ r: fanning ? 7.5 : 4.5 }}
          transition={SETTLE}
        />
        {TRACK_OFFSETS.map((off, i) => (
          <LocaleLabel
            key={off}
            progress={progress}
            index={i}
            offset={off}
            text={labels.locales[i] ?? ""}
          />
        ))}
        <line
          x1={FAN_X}
          y1={FAN_TOP - 12}
          x2={FAN_X}
          y2={FAN_TOP - 40}
          stroke={fanning ? "rgba(0,168,240,.45)" : "rgba(250,250,248,.06)"}
          strokeWidth={1}
        />
        <text
          x={FAN_X}
          y={FAN_TOP - 48}
          textAnchor="start"
          className="tp-label"
          fill={fanning ? EL3 : LABEL}
        >
          {labels.fan}
        </text>
        <m.text
          x={FAN_X}
          y={FAN_TOP - 66}
          textAnchor="start"
          className="tp-sub"
          fill={DIM}
          animate={{ opacity: fanning ? 1 : 0 }}
          transition={RESPONSE}
        >
          {labels.fanNote}
        </m.text>
      </g>

      {/* --------------------------------------------------- publish gate */}
      <g {...station("publish")}>
        <rect
          x={X_GATE - 34}
          y={GATE_Y - 44}
          width={68}
          height={88}
          rx={10}
          fill="transparent"
        />
        <g transform={GATE_TILT}>
          <m.line
            x1={X_GATE}
            x2={X_GATE}
            y1={GATE_Y - 34}
            y2={GATE_Y - 3}
            stroke={gateOpen ? EL : FAINT}
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ y2: GATE_Y - 3 }}
            animate={{ y2: GATE_Y - (gateOpen ? 17 : 3) }}
            transition={SETTLE}
          />
          <m.line
            x1={X_GATE}
            x2={X_GATE}
            y2={GATE_Y + 34}
            y1={GATE_Y + 3}
            stroke={gateOpen ? EL : FAINT}
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ y1: GATE_Y + 3 }}
            animate={{ y1: GATE_Y + (gateOpen ? 17 : 3) }}
            transition={SETTLE}
          />
        </g>
        <line
          x1={X_GATE}
          y1={PUB_LEAD}
          x2={X_GATE}
          y2={PUB_LABEL - 12}
          stroke={gateOpen ? "rgba(0,168,240,.45)" : "rgba(250,250,248,.06)"}
          strokeWidth={1}
        />
        <rect
          x={X_GATE - 54}
          y={PUB_LABEL - 12}
          width={108}
          height={20}
          fill="#10141c"
        />
        <text
          x={X_GATE}
          y={PUB_LABEL}
          textAnchor="middle"
          className="tp-label"
          fill={gateOpen ? EL3 : LABEL}
        >
          {labels.publish}
        </text>
        <m.g animate={{ opacity: gateOpen ? 1 : 0 }} transition={RESPONSE}>
          <rect
            x={X_GATE - 110}
            y={PUB_LABEL + 6}
            width={220}
            height={19}
            fill="#10141c"
          />
          <text
            x={X_GATE}
            y={PUB_LABEL + 18}
            textAnchor="middle"
            className="tp-sub"
            fill={DIM}
          >
            {labels.publishTool}
          </text>
        </m.g>
      </g>

      {/* -------------------------------------------- terminus, never moves */}
      <g {...station("frontend")}>
        <rect
          x={TERM.x}
          y={TERM.y}
          width={TERM.w}
          height={TERM.h}
          rx={10}
          fill="#0b0e15"
          stroke="rgba(250,250,248,.18)"
          strokeWidth={1.5}
          filter="url(#tp-lift)"
        />
        <text
          x={TERM.x}
          y={TERM.y - 14}
          className="tp-label"
          fill="rgba(250,250,248,.45)"
        >
          {labels.frontend}
        </text>
        {labels.code.map((line, i) => (
          <text
            key={i}
            x={TERM.x + 16}
            y={TERM.y + 30 + i * 21}
            className="tp-code"
            fill="rgba(250,250,248,.55)"
          >
            {line}
          </text>
        ))}
        <line
          x1={TERM.x + 16}
          y1={TERM.y + 100}
          x2={TERM.x + TERM.w - 16}
          y2={TERM.y + 100}
          stroke="rgba(250,250,248,.1)"
          strokeWidth={1}
        />
        <text
          x={TERM.x + 16}
          y={TERM.y + 120}
          className="tp-count"
          fill="rgba(250,250,248,.38)"
        >
          {labels.revalidated}
        </text>
        <RollingNumber
          x={TERM.x + 16 + labels.revalidated.length * 7.4 + 9}
          y={TERM.y + 120}
          value={landed ? labels.locales.length : 0}
          fill={landed ? EL3 : "rgba(250,250,248,.38)"}
          reduced={reduced}
        />
        <text
          x={TERM.x + 16}
          y={TERM.y + 138}
          className="tp-count"
          fill="rgba(250,250,248,.38)"
        >
          {labels.deploys} 0
        </text>
      </g>

      {/* -------------------------------------------------------- payloads */}
      <m.g style={{ opacity: trunkVisible }} aria-hidden>
        <m.circle
          cx={payX}
          cy={payY}
          r={5.5}
          fill={EL}
          filter="url(#tp-glow)"
        />
      </m.g>
      {TRACK_OFFSETS.map((off, i) => (
        <TrackPayload key={off} progress={progress} index={i} offset={off} />
      ))}

      {/* the bus stub between merge and gate, always drawn */}
      <m.line
        x1={F_D}
        y1={axisY(F_D)}
        x2={X_BUS}
        y2={axisY(X_BUS)}
        stroke={gateOpen ? EL : FAINT}
        strokeWidth={gateOpen ? 3 : 2}
        strokeLinecap="round"
        style={{ strokeOpacity: busO }}
        aria-hidden
      />
    </>
  );
}

function LocaleLabel({
  progress,
  index,
  offset,
  text,
}: {
  progress: Sequence["progress"];
  index: number;
  offset: number;
  text: string;
}) {
  const y = trackYAt(F_C, offset);
  const opacity = useTransform(progress, (p) =>
    trackXAt(xAt(p), index) >= F_C ? 1 : 0.22,
  );
  return (
    <g>
      <rect x={F_C + 8} y={y - 9} width={26} height={18} fill="#10141c" />
      <m.text
        x={F_C + 12}
        y={y + 4}
        className="tp-locale"
        fill={EL3}
        style={{ opacity }}
      >
        {text}
      </m.text>
    </g>
  );
}

function TrackPayload({
  progress,
  index,
  offset,
}: {
  progress: Sequence["progress"];
  index: number;
  offset: number;
}) {
  const x = useTransform(progress, (p) => trackXAt(xAt(p), index));
  const y = useTransform(x, (v) => trackYAt(v, offset));
  const opacity = useTransform(progress, (p) => {
    const v = xAt(p);
    return v > F_A + 2 && v < F_D - 2 ? 1 : 0;
  });
  return (
    <m.circle
      cx={x}
      cy={y}
      r={4.5}
      fill={EL}
      filter="url(#tp-glow)"
      style={{ opacity }}
      aria-hidden
    />
  );
}
