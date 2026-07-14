import type { BlockProps } from "@cmssy/react";
import { Container } from "../../../components/container";
import type { docsFileTreeProps } from "../block";

const FILE_ICONS: Record<string, string> = {
  ts: "📘",
  tsx: "⚛️",
  js: "📒",
  jsx: "⚛️",
  json: "📋",
  css: "🎨",
  scss: "🎨",
  md: "📝",
  html: "🌐",
  svg: "🖼️",
  png: "🖼️",
  jpg: "🖼️",
  env: "🔒",
  yml: "⚙️",
  yaml: "⚙️",
  toml: "⚙️",
  lock: "🔒",
  gitignore: "👁️",
};

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (name.startsWith(".")) {
    const dotFile = name.slice(1).toLowerCase();
    return FILE_ICONS[dotFile] ?? "📄";
  }
  return FILE_ICONS[ext] ?? "📄";
}

function isDirectory(name: string): boolean {
  return name.endsWith("/");
}

interface TreeLine {
  prefix: string;
  name: string;
  isDir: boolean;
}

function parseTree(raw: string): TreeLine[] {
  return raw
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      // Find where the actual name starts (after tree drawing chars)
      const match = line.match(/^(.*?(?:├──|└──|│)\s*)/);
      let prefix: string;
      let name: string;

      if (match) {
        prefix = match[1];
        name = line.slice(prefix.length).trim();
      } else {
        // Root line or plain text
        prefix = "";
        name = line.trim();
      }

      return {
        prefix,
        name,
        isDir: isDirectory(name),
      };
    });
}

export default function DocsFileTree({
  content,
}: BlockProps<typeof docsFileTreeProps>) {
  const { title, tree, highlights = "", showIcons = true } = content;

  const lines = tree ? parseTree(tree) : [];
  const highlightSet = new Set(
    highlights
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean),
  );

  function isHighlighted(name: string): boolean {
    const clean = name.replace(/\/$/, "");
    return highlightSet.has(clean) || highlightSet.has(name);
  }

  return (
    <Container as="section" className="py-6">
      {title && (
        <h3 className="text-lg font-semibold font-mono mb-3">{title}</h3>
      )}

      <div className="rounded-lg border bg-zinc-950 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
          <span className="text-zinc-400 text-xs font-mono uppercase tracking-wider">
            Files
          </span>
        </div>

        {lines.length > 0 ? (
          <pre className="px-4 py-3 text-sm font-mono leading-relaxed overflow-x-auto">
            {lines.map((line, i) => {
              const highlighted = isHighlighted(line.name);
              return (
                <div
                  key={i}
                  className={
                    highlighted
                      ? "bg-violet-500/10 -mx-4 px-4 text-violet-300"
                      : "text-zinc-300"
                  }
                >
                  <span className="text-zinc-600 select-none">
                    {line.prefix}
                  </span>
                  {showIcons && (
                    <span className="mr-1.5 select-none">
                      {line.isDir ? "📁" : getFileIcon(line.name)}
                    </span>
                  )}
                  <span
                    className={
                      line.isDir
                        ? "font-semibold text-sky-400"
                        : highlighted
                          ? "text-violet-300"
                          : "text-zinc-300"
                    }
                  >
                    {line.name}
                  </span>
                </div>
              );
            })}
          </pre>
        ) : null}
      </div>
    </Container>
  );
}
