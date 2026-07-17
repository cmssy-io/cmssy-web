const ACCENT = "#00A8F0";

export function CmssyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 604 604"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect x="0" y="432" width="172" height="172" rx="40" fill="currentColor" />
      <rect x="0" y="216" width="172" height="172" rx="40" fill="currentColor" />
      <rect x="216" y="216" width="172" height="172" rx="40" fill={ACCENT} />
      <rect x="216" y="0" width="172" height="172" rx="40" fill={ACCENT} />
      <rect x="432" y="0" width="172" height="172" rx="40" fill="currentColor" />
    </svg>
  );
}
