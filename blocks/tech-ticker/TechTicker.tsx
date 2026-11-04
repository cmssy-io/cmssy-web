import type { BlockProps } from "@cmssy/react";
import type { techTickerProps } from "./block";

const MIN_TRACK_ITEMS = 16;

function TickerList({
  labels,
  hidden,
}: {
  labels: string[];
  hidden?: boolean;
}) {
  return (
    <ul
      className="m-0 flex min-w-[100vw] list-none items-center justify-evenly p-0"
      aria-hidden={hidden ? true : undefined}
    >
      {labels.map((label, i) => (
        <li key={i} className="flex items-center">
          <span className="px-6 whitespace-nowrap md:px-9">{label}</span>
          <span className="size-1 shrink-0 rounded-xs bg-elektryk" />
        </li>
      ))}
    </ul>
  );
}

export default function TechTicker({
  content,
}: BlockProps<typeof techTickerProps>) {
  const { items = [], ariaLabel = "" } = content;
  const labels = items
    .map((item) => item.label?.trim() ?? "")
    .filter((label) => label.length > 0);
  if (labels.length === 0) return null;
  const copies = Math.ceil(MIN_TRACK_ITEMS / labels.length);
  const track = Array.from({ length: copies }, () => labels).flat();

  return (
    <section
      className="tech-ticker h-12 overflow-hidden border-t border-paper/10 bg-ink font-mono text-label tracking-[0.14em] text-paper/45 uppercase"
      aria-label={ariaLabel || undefined}
      role="marquee"
      tabIndex={0}
    >
      <div className="tech-ticker__track flex h-full w-max items-center">
        <TickerList labels={track} />
        <TickerList labels={track} hidden />
      </div>
    </section>
  );
}
