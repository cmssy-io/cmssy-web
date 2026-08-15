"use client";

import { m, useTransform } from "motion/react";
import { RESPONSE, SETTLE } from "@/components/motion/presets";
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
  M,
  M_STREAK_SCALE,
  mFanBlend,
  mSpinePath,
  mTrackPath,
  mTrackXAt,
  mYAt,
} from "./geometry";
import type { Sequence, StationKey } from "./useTransportSequence";
import type { TransportLabels } from "./labels";

const SPINE_LEN = M.yTerm - M.yStart;
const FAN_LEN = M.fanD - M.fanA;
const LAG = [30, 14, 0, 14, 30];

const RAIL_WIDTHS = [0.5, 0.82, 0.36, 0.62];
const WRITTEN_RAIL = 1;

const TERM = { x: 22, y: 570, w: 346, h: 92 };

interface Props {
  seq: Sequence;
  reduced: boolean;
  labels: TransportLabels;
}

export function TransportMobile({ seq, reduced, labels }: Props) {
  const { progress, streak: rawStreak, wave, settle, stage, scrubTo } = seq;
  const streak = useTransform(rawStreak, (v) => v * M_STREAK_SCALE);

  const inletOn = stage >= 1;
  const docked = stage >= 2;
  const fanning = stage >= 3;
  const gateOpen = stage >= 4;
  const landed = stage >= 5;

  const payY = useTransform(progress, (p) => Math.min(mYAt(p), M.yTerm));
  const trunkVisible = useTransform(progress, (p) =>
    mYAt(p) <= M.fanA + 4 || mYAt(p) >= M.fanD - 4 ? 1 : 0,
  );

  const waveR = useTransform(wave, [0, 1], [10, 330]);
  const waveO = useTransform(wave, [0, 0.15, 0.75, 1], [0, 0.45, 0.24, 0]);

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

  return (
    <>
      <TransportDefs />

      <g aria-hidden>
        {[64, 150, 236, 322, 408, 494, 580, 666].map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={M.width}
            y2={y}
            stroke="rgba(250,250,248,.045)"
            strokeWidth={1}
          />
        ))}
        <path d={mSpinePath()} fill="none" stroke={FAINT} strokeWidth={1.5} />
        {M.offsets.map((off) => (
          <path
            key={off}
            d={mTrackPath(off)}
            fill="none"
            stroke={FAINT}
            strokeWidth={1.5}
          />
        ))}
      </g>

      <LitPath
        d={mSpinePath()}
        worldLength={SPINE_LEN}
        sOf={(p) => Math.min(1, Math.max(0, (mYAt(p) - M.yStart) / SPINE_LEN))}
        progress={progress}
        streak={streak}
        settle={settle}
        rest={0.34}
      />
      {M.offsets.map((off, i) => (
        <LitPath
          key={off}
          d={mTrackPath(off)}
          worldLength={FAN_LEN}
          sOf={(p) => {
            const y = mYAt(p);
            const lagged = Math.max(M.fanA, y - LAG[i] * mFanBlend(y));
            return Math.min(1, Math.max(0, (lagged - M.fanA) / FAN_LEN));
          }}
          progress={progress}
          streak={streak}
          settle={settle}
          rest={0.24}
        />
      ))}

      <m.circle
        cx={M.spine}
        cy={M.yGate}
        r={waveR}
        fill="none"
        stroke={EL}
        strokeWidth={2}
        style={{ opacity: waveO }}
        aria-hidden
      />

      {/* --------------------------------------------------------- inlet */}
      <g {...station("mcp")}>
        <rect
          x={M.spine - 40}
          y={M.yMcp - 30}
          width={280}
          height={62}
          fill="transparent"
        />
        <circle
          cx={M.spine}
          cy={M.yMcp}
          r={6.5}
          fill={inletOn ? EL : "#10141c"}
          stroke={inletOn ? EL : FAINT}
          strokeWidth={1.5}
        />
        <text
          x={M.spine + 26}
          y={M.yMcp - 2}
          className="tp-label"
          fill={inletOn ? EL3 : LABEL}
        >
          {labels.mcp}
        </text>
        <m.text
          x={M.spine + 26}
          y={M.yMcp + 16}
          className="tp-sub"
          fill={DIM}
          animate={{ opacity: inletOn ? 1 : 0 }}
          transition={RESPONSE}
        >
          {labels.mcpTool}
        </m.text>
      </g>

      {/* --------------------------------------------------------- block */}
      <g {...station("block")}>
        <rect
          x={M.spine - 52}
          y={M.yBlk - 44}
          width={300}
          height={88}
          fill="transparent"
        />
        <m.g animate={{ y: docked ? 2 : 0 }} transition={SETTLE}>
          <rect
            x={M.spine - 38}
            y={M.yBlk - 32}
            width={76}
            height={64}
            rx={8}
            fill="#0d1119"
            stroke={docked ? "rgba(0,168,240,.6)" : FAINT}
            strokeWidth={1.5}
            filter={docked ? "url(#tp-lift)" : undefined}
          />
          {RAIL_WIDTHS.map((w, i) => (
            <m.rect
              key={i}
              x={M.spine - 26}
              y={M.yBlk - 20 + i * 11}
              width={Math.round(52 * w)}
              height={4}
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
        <text
          x={M.spine + 54}
          y={M.yBlk - 4}
          className="tp-label"
          fill={docked ? EL3 : LABEL}
        >
          {labels.block}
        </text>
        <m.text
          x={M.spine + 54}
          y={M.yBlk + 14}
          className="tp-sub"
          fill={DIM}
          animate={{ opacity: docked ? 1 : 0 }}
          transition={RESPONSE}
        >
          {labels.blockFields}
        </m.text>
      </g>

      {/* ----------------------------------------------------------- fan */}
      <g {...station("fan")}>
        <rect
          x={0}
          y={M.fanA - 10}
          width={M.width}
          height={FAN_LEN + 20}
          fill="transparent"
        />
        <m.circle
          cx={M.spine}
          cy={M.fanA}
          fill={fanning ? EL : "#10141c"}
          stroke={fanning ? EL : FAINT}
          strokeWidth={1.5}
          r={4}
          initial={{ r: 4 }}
          animate={{ r: fanning ? 6.5 : 4 }}
          transition={SETTLE}
        />
        {M.offsets.map((off, i) => (
          <MobileLocale
            key={off}
            progress={progress}
            index={i}
            offset={off}
            text={labels.locales[i] ?? ""}
          />
        ))}
        <text
          x={M.width - 14}
          y={M.fanB + 30}
          textAnchor="end"
          className="tp-label"
          fill={fanning ? EL3 : LABEL}
        >
          {labels.fan}
        </text>
        <m.text
          x={M.width - 14}
          y={M.fanB + 48}
          textAnchor="end"
          className="tp-sub"
          fill={DIM}
          animate={{ opacity: fanning ? 1 : 0 }}
          transition={RESPONSE}
        >
          {labels.fanNote}
        </m.text>
      </g>

      {/* -------------------------------------------------------- publish */}
      <g {...station("publish")}>
        <rect
          x={M.spine - 60}
          y={M.yGate - 30}
          width={300}
          height={60}
          fill="transparent"
        />
        <m.line
          y1={M.yGate}
          y2={M.yGate}
          x1={M.spine - 46}
          x2={M.spine - 3}
          stroke={gateOpen ? EL : FAINT}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ x2: M.spine - 3 }}
          animate={{ x2: M.spine - (gateOpen ? 16 : 3) }}
          transition={SETTLE}
        />
        <m.line
          y1={M.yGate}
          y2={M.yGate}
          x2={M.spine + 46}
          x1={M.spine + 3}
          stroke={gateOpen ? EL : FAINT}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ x1: M.spine + 3 }}
          animate={{ x1: M.spine + (gateOpen ? 16 : 3) }}
          transition={SETTLE}
        />
        <text
          x={M.spine + 62}
          y={M.yGate - 2}
          className="tp-label"
          fill={gateOpen ? EL3 : LABEL}
        >
          {labels.publish}
        </text>
        <m.text
          x={M.spine + 62}
          y={M.yGate + 16}
          className="tp-sub"
          fill={DIM}
          animate={{ opacity: gateOpen ? 1 : 0 }}
          transition={RESPONSE}
        >
          {labels.publishTool}
        </m.text>
      </g>

      {/* ------------------------------------------------------- terminus */}
      <g {...station("frontend")}>
        <text
          x={TERM.x + TERM.w - 2}
          y={TERM.y - 12}
          textAnchor="end"
          className="tp-label"
          fill="rgba(250,250,248,.45)"
        >
          {labels.frontend}
        </text>
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
          x={TERM.x + 16}
          y={TERM.y + 30}
          className="tp-code"
          fill="rgba(250,250,248,.55)"
        >
          {labels.code[labels.code.length - 1]}
        </text>
        <line
          x1={TERM.x + 16}
          y1={TERM.y + 48}
          x2={TERM.x + TERM.w - 16}
          y2={TERM.y + 48}
          stroke="rgba(250,250,248,.1)"
          strokeWidth={1}
        />
        <text
          x={TERM.x + 16}
          y={TERM.y + 70}
          className="tp-count"
          fill="rgba(250,250,248,.38)"
        >
          {labels.revalidated}
        </text>
        <RollingNumber
          x={TERM.x + 16 + labels.revalidated.length * 7.4 + 9}
          y={TERM.y + 70}
          value={landed ? labels.locales.length : 0}
          fill={landed ? EL3 : "rgba(250,250,248,.38)"}
          reduced={reduced}
        />
        <text
          x={TERM.x + 16 + labels.revalidated.length * 7.4 + 9 + 26}
          y={TERM.y + 70}
          className="tp-count"
          fill="rgba(250,250,248,.28)"
        >
          {`· ${labels.deploys} 0`}
        </text>
      </g>

      <m.g style={{ opacity: trunkVisible }} aria-hidden>
        <m.circle
          cx={M.spine}
          cy={payY}
          r={5}
          fill={EL}
          filter="url(#tp-glow)"
        />
      </m.g>
      {M.offsets.map((off, i) => (
        <MobilePayload key={off} progress={progress} index={i} offset={off} />
      ))}
    </>
  );
}

function laggedY(p: number, index: number) {
  const y = mYAt(p);
  return Math.max(M.fanA, y - LAG[index] * mFanBlend(y));
}

function MobileLocale({
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
  const x = M.spine + offset;
  const y = M.yLocale;
  const opacity = useTransform(progress, (p) =>
    laggedY(p, index) >= y ? 1 : 0.22,
  );
  return (
    <g>
      <rect x={x - 13} y={y - 13} width={26} height={18} fill="#10141c" />
      <m.text
        x={x}
        y={y}
        textAnchor="middle"
        className="tp-locale"
        fill={EL3}
        style={{ opacity }}
      >
        {text}
      </m.text>
    </g>
  );
}

function MobilePayload({
  progress,
  index,
  offset,
}: {
  progress: Sequence["progress"];
  index: number;
  offset: number;
}) {
  const y = useTransform(progress, (p) => laggedY(p, index));
  const x = useTransform(y, (v) => mTrackXAt(v, offset));
  const opacity = useTransform(progress, (p) => {
    const v = mYAt(p);
    return v > M.fanA + 2 && v < M.fanD - 2 ? 1 : 0;
  });
  return (
    <m.circle
      cx={x}
      cy={y}
      r={4}
      fill={EL}
      filter="url(#tp-glow)"
      style={{ opacity }}
      aria-hidden
    />
  );
}
