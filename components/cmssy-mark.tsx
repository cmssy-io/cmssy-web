const ACCENT = "#00A8F0";

export function CmssyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 580 710"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect x="0" y="190" width="360" height="520" rx="90" fill="currentColor" />
      <rect x="0" y="350" width="520" height="360" rx="90" fill="currentColor" />
      <rect x="60" y="410" width="260" height="240" fill="currentColor" />
      <rect x="420" y="0" width="160" height="160" rx="36" fill={ACCENT} />
    </svg>
  );
}

export function CmssyMarkMini({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 580 710"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect x="0" y="210" width="500" height="500" rx="120" fill="currentColor" />
      <rect x="390" y="0" width="190" height="190" rx="56" fill="#00A8F0" />
    </svg>
  );
}
