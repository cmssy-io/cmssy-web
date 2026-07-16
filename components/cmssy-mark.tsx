const ACCENT = "#7c3aed";

export function CmssyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="6.5 6.5 19 19"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="6.5"
        y="8.95"
        width="7.28"
        height="7.28"
        rx="1.68"
        fill="currentColor"
      />
      <rect
        x="6.5"
        y="18.2"
        width="7.28"
        height="7.28"
        rx="1.68"
        fill="currentColor"
      />
      <rect
        x="15.77"
        y="18.2"
        width="7.28"
        height="7.28"
        rx="1.68"
        fill="currentColor"
      />
      <rect
        x="18.2"
        y="6.5"
        width="7.28"
        height="7.28"
        rx="1.68"
        fill={ACCENT}
      />
    </svg>
  );
}
