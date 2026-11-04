export function trapModal(dialog: HTMLElement | null, first: HTMLElement | null) {
  if (!dialog) return () => {};
  const trigger = document.activeElement as HTMLElement | null;
  const others = Array.from(document.body.children).filter(
    (el) => !el.contains(dialog) && !el.hasAttribute("inert"),
  );
  for (const el of others) el.setAttribute("inert", "");
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  (first ?? dialog).focus();
  return () => {
    for (const el of others) el.removeAttribute("inert");
    document.body.style.overflow = prevOverflow;
    trigger?.focus?.();
  };
}
