export function FigEyebrow({
  fig,
  label,
  dark,
}: {
  fig: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.14em] uppercase ${
        dark
          ? "border-paper/15 text-paper/70"
          : "border-ink/15 text-ink/60"
      }`}
    >
      <span className="inline-block size-1.5 rounded-[2px] bg-elektryk" />
      {fig} — {label}
    </span>
  );
}
