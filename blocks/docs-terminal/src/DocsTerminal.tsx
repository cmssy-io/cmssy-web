import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

const CLI_KEYWORDS = [
  "npx",
  "npm",
  "pnpm",
  "yarn",
  "bun",
  "cd",
  "mkdir",
  "rm",
  "cp",
  "mv",
  "ls",
  "cat",
  "echo",
  "export",
  "sudo",
  "git",
  "node",
  "deno",
  "cmssy",
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Render a shell command with violet CLI keyword highlight and dimmed comments. */
function renderCleanCommand(command: string): string {
  const escaped = escapeHtml(command);
  const keywordPattern = new RegExp(`\\b(${CLI_KEYWORDS.join("|")})\\b`, "g");
  return escaped.replace(
    keywordPattern,
    '<span class="text-violet-400">$1</span>',
  );
}

export default function DocsTerminal({ content }: { content: BlockContent }) {
  const { title, commands = [], theme = "macos", showCopyAll = true } = content;

  const [copied, setCopied] = useState(false);

  const allCommands = commands.map((c) => c.command).join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(allCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isClean = theme === "clean";

  return (
    <Container className="py-6">
      <div
        className={
          isClean
            ? "rounded-xl overflow-hidden bg-slate-900 shadow-xl"
            : "rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg"
        }
      >
        {/* Title bar */}
        <div
          className={
            isClean
              ? "flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700"
              : "flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800"
          }
        >
          <div className="flex items-center gap-3">
            {/* macOS dots */}
            {theme === "macos" && (
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-500/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
              </div>
            )}
            {(title || isClean) && (
              <span
                className={
                  isClean
                    ? "text-xs text-slate-400 font-medium tracking-wide"
                    : "text-xs text-zinc-500 font-medium"
                }
              >
                {title || "Terminal"}
              </span>
            )}
          </div>
          {showCopyAll && commands.length > 0 && (
            <button
              onClick={handleCopy}
              className={
                isClean
                  ? "flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700/60"
                  : "flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800"
              }
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Terminal body */}
        {isClean ? (
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-slate-100">
              <code>
                {commands.map((cmd, index) => {
                  const trimmed = cmd.command.trimStart();
                  const isComment = trimmed.startsWith("#");
                  return (
                    <div
                      key={index}
                      className={index > 0 ? "mt-2" : undefined}
                    >
                      <div
                        className={isComment ? "text-slate-500" : undefined}
                        dangerouslySetInnerHTML={{
                          __html: isComment
                            ? escapeHtml(cmd.command)
                            : renderCleanCommand(cmd.command),
                        }}
                      />
                      {cmd.output && (
                        <div className="mt-1 text-slate-500 text-xs leading-relaxed whitespace-pre-wrap">
                          {cmd.output}
                        </div>
                      )}
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        ) : (
          <div className="p-4 font-mono text-sm leading-relaxed">
            {commands.map((cmd, index) => (
              <div key={index} className={index > 0 ? "mt-3" : ""}>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 select-none shrink-0">
                    {cmd.prompt || "$"}
                  </span>
                  <span className="text-zinc-100">{cmd.command}</span>
                </div>
                {cmd.output && (
                  <pre className="mt-1 text-zinc-500 text-xs leading-relaxed whitespace-pre-wrap pl-5">
                    {cmd.output}
                  </pre>
                )}
              </div>
            ))}
            {/* Blinking cursor */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-emerald-400 select-none">$</span>
              <span className="w-2 h-4 bg-zinc-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
