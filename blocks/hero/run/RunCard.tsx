import type { RunLabels } from "./labels";

type Actor = "agent" | "cmssy" | "app";

const ACTOR_LABEL: Record<Actor, string> = {
  agent: "Agent",
  cmssy: "cmssy",
  app: "Your app",
};

const ACTOR_TONE: Record<Actor, string> = {
  agent: "text-elektryk-300",
  cmssy: "text-paper/45",
  app: "text-paper/45",
};

function Step({
  index,
  title,
  detail,
  actor,
  children,
}: {
  index: number;
  title: string;
  detail: string;
  actor: Actor;
  children?: React.ReactNode;
}) {
  return (
    <li
      className="hero-run__step rounded-lg px-3 py-2.5"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="hero-run__title font-medium text-paper/90">
          {title}
        </span>
        <span
          className={`shrink-0 font-mono text-label tracking-[0.12em] uppercase ${ACTOR_TONE[actor]}`}
        >
          {ACTOR_LABEL[actor]}
        </span>
      </div>
      <div className="mt-0.5 font-mono text-caption text-paper/45">{detail}</div>
      {children}
    </li>
  );
}

export function RunCard({ labels }: { labels: RunLabels }) {
  return (
    <div className="hero-run rounded-2xl border border-paper/10 bg-ink-deep/70 p-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-3 pt-2 pb-3">
        <span className="font-mono text-label tracking-[0.14em] text-paper/45 uppercase">
          agent session
        </span>
        <span className="flex items-center gap-1.5 font-mono text-label text-paper/45">
          <span className="hero-run__dot inline-block size-1.5 rounded-full bg-elektryk" />
          live
        </span>
      </div>

      <ol className="space-y-1 text-sm">
        <Step index={0} title={labels.mcp} detail={labels.mcpTool} actor="agent" />
        <Step
          index={1}
          title={labels.block}
          detail={labels.blockFields}
          actor="cmssy"
        />
        <Step index={2} title={labels.fan} detail={labels.fanNote} actor="cmssy">
          <div className="mt-2 flex flex-wrap gap-1.5">
            {labels.locales.map((code) => (
              <span
                key={code}
                className="rounded-md border border-paper/10 px-1.5 py-0.5 font-mono text-label text-paper/60"
              >
                {code}
              </span>
            ))}
          </div>
        </Step>
        <Step
          index={3}
          title={labels.publish}
          detail={labels.publishTool}
          actor="agent"
        />
        <Step index={4} title={labels.frontend} detail={labels.code[0] ?? ""} actor="app" />
      </ol>

      <div className="mt-2 grid grid-cols-2 gap-2 border-t border-paper/10 px-1 pt-3 pb-1">
        <div className="rounded-lg bg-paper/[0.04] px-3 py-2.5">
          <div className="font-mono text-label tracking-[0.12em] text-paper/45 uppercase">
            {labels.revalidated}
          </div>
          <div className="mt-1 font-heading text-h3 font-bold text-elektryk">1</div>
        </div>
        <div className="rounded-lg bg-paper/[0.04] px-3 py-2.5">
          <div className="font-mono text-label tracking-[0.12em] text-paper/45 uppercase">
            {labels.deploys}
          </div>
          <div className="mt-1 font-heading text-h3 font-bold text-paper">0</div>
        </div>
      </div>
    </div>
  );
}
