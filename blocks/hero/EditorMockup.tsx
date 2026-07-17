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
}: {
  chatPrompt: string;
  chatStatus: string;
  title: string;
  badge: string;
  meta: string;
  pages: { name: string; tag?: string }[];
  dockLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper/10 bg-[#14161b] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 border-b border-paper/10 px-4 py-2.5">
        <span className="size-3 rounded-[4px] bg-elektryk" />
        <span className="font-mono text-[12px] text-paper/70">{title}</span>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
          {badge}
        </span>
        <span className="ml-auto font-mono text-[11px] text-paper/40">
          {meta}
        </span>
        <span className="grid size-6 place-items-center rounded-full bg-elektryk/20 font-mono text-[9px] text-elektryk">
          AD
        </span>
      </div>

      <div className="flex">
        <div className="hidden w-36 shrink-0 border-r border-paper/10 p-3 sm:block">
          <div className="font-mono text-[10px] tracking-wider text-paper/35 uppercase">
            Pages
          </div>
          <ul className="mt-2 space-y-1 text-[12px]">
            {pages.map((p, i) => (
              <li
                key={p.name}
                className={
                  i === 0
                    ? "rounded bg-elektryk/15 px-2 py-1 font-medium text-elektryk"
                    : "flex items-center justify-between px-2 py-1 text-paper/55"
                }
              >
                {p.name}
                {i > 0 && p.tag && (
                  <span className="rounded bg-paper/10 px-1 font-mono text-[9px] text-paper/45">
                    {p.tag}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="dot-grid-light relative min-h-[290px] flex-1 bg-paper p-4">
          <div
            className="hero-anim h-7 rounded-md border border-ink/10 bg-white"
            style={d("0.1s")}
          />
          <div
            className="hero-anim relative mt-2 rounded-md border-2 border-elektryk/70 bg-white px-3 py-2"
            style={d("0.5s")}
          >
            <span className="absolute -top-2 left-2 rounded-sm bg-elektryk px-1 font-mono text-[8px] text-white">
              Heading
            </span>
            <div className="h-3 w-3/4 rounded bg-ink/15" />
          </div>
          <div
            className="hero-anim mt-2 h-16 rounded-md border border-ink/10"
            style={{
              ...d("0.9s"),
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(16,20,28,.06) 0 6px, transparent 6px 12px)",
            }}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div
              className="hero-anim h-12 rounded-md border border-ink/10 bg-white"
              style={d("1.3s")}
            />
            <div
              className="hero-anim h-12 rounded-md border border-ink/10 bg-white"
              style={d("1.6s")}
            />
          </div>
          <div
            className="hero-anim mt-2 rounded-md bg-elektryk px-3 py-2 font-mono text-[10px] text-white"
            style={d("5.4s", "hero-dock")}
          >
            {dockLabel}
          </div>

          <div
            className="hero-anim absolute right-3 bottom-3 left-3 rounded-lg border border-ink/10 bg-white p-2.5 shadow-lg"
            style={d("0s", "hero-chat-in")}
          >
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-[2px] bg-elektryk" />
              <span className="relative overflow-hidden font-mono text-[11px] whitespace-nowrap text-ink/80">
                <span
                  className="hero-anim inline-block overflow-hidden align-bottom whitespace-nowrap"
                  style={d("0s", "hero-type")}
                >
                  {chatPrompt}
                </span>
              </span>
            </div>
            <div className="mt-1 pl-4 font-mono text-[10px] text-emerald-600">
              ✓ {chatStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
