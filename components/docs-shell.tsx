// Wraps every docs page with the docs typography and accent scope (see
// styles/main.css). The theme itself is site-wide - the switch lives in the
// header.
export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
