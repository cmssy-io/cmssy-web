export type QuickstartRow = {
  tab?: string;
  runner?: string;
  command: string;
  note?: string;
  noteLabel?: string;
  noteUrl?: string;
};

export type QuickstartTab = {
  label: string;
  runners: string[];
  commands: Record<string, string>;
  note: string;
  noteLabel: string;
  noteUrl: string;
};

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

export function groupQuickstart(rows: QuickstartRow[]): QuickstartTab[] {
  const tabs: QuickstartTab[] = [];
  for (const row of rows) {
    const command = clean(row.command);
    if (!command) continue;
    const label = clean(row.tab);
    let tab = tabs.find((entry) => entry.label === label);
    if (!tab) {
      tab = { label, runners: [], commands: {}, note: "", noteLabel: "", noteUrl: "" };
      tabs.push(tab);
    }
    const runner = clean(row.runner);
    if (!(runner in tab.commands)) {
      tab.runners.push(runner);
      tab.commands[runner] = command;
    }
    if (!tab.note && clean(row.note)) {
      tab.note = clean(row.note);
      tab.noteLabel = clean(row.noteLabel);
      tab.noteUrl = clean(row.noteUrl);
    }
  }
  return tabs;
}

export function pickRunner(tab: QuickstartTab, preferred: string): string {
  return tab.runners.includes(preferred) ? preferred : (tab.runners[0] ?? "");
}
