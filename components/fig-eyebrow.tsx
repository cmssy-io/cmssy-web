export function FigEyebrow({
  fig,
  label,
  dark,
  pill,
}: {
  fig: string;
  label: string;
  dark?: boolean;
  pill?: boolean;
}) {
  if (!fig && !label) return null;
  const plate = fig && !/^fig\b/i.test(fig.trim()) ? `FIG ${fig.trim()}` : fig;
  const text = plate && label ? `${plate} — ${label}` : plate || label;
  const tone = dark ? "text-paper/60" : "text-muted-foreground";
  if (pill) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.14em] uppercase ${
          dark
            ? "border-paper/15 text-paper/70"
            : "border-border text-muted-foreground"
        }`}
      >
        <span className="inline-block size-1.5 rounded-[2px] bg-elektryk" />
        {text}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.14em] uppercase ${tone}`}
    >
      {text}
    </span>
  );
}
