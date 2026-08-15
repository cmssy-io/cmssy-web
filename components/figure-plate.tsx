export function plateNumber(fig: string, index: number) {
  const m = fig.trim().match(/(\d+)\.(\d+)/);
  if (!m) return "";
  return `${m[1]}.${Number(m[2]) + index + 1}`;
}

export function FigurePlate({
  fig,
  caption,
  dark,
  className,
  children,
}: {
  fig?: string;
  caption?: string;
  dark?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const label = [fig ? `FIG ${fig}` : "", caption].filter(Boolean).join(" — ");

  return (
    <figure className={className}>
      <div
        className={`overflow-hidden rounded-xl border ${
          dark
            ? "dot-grid-dark border-white/10 bg-ink-deep"
            : "dot-grid-light border-border bg-card"
        }`}
      >
        {children}
      </div>
      {label ? (
        <figcaption
          className={`mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase ${
            dark ? "text-paper/45" : "text-muted-foreground"
          }`}
        >
          <span className="inline-block size-1.5 rounded-[2px] bg-elektryk" />
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
