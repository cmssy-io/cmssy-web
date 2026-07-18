import { Fragment } from "react";

const TOKEN =
  /("[^"\n]*")|(\/\/[^\n]*|#[^\n]*|—[^\n]*)|(\b(?:import|from|export|default|async|function|const|await|return|query)\b)|(<\/?[A-Z][\w.]*|\/>)|(✓)|(^[>] |(?<=✓ )[a-z_]+)|((?<=:\s)[A-Z]\w*!?)|(--[\w-]+|^\$(?= ))|([A-Za-z_][\w]*(?=\())/gm;

const TOKEN_COLORS = [
  "#6ee7b7", // string
  "#7f8794", // comment / em-dash aside
  "#6ec8f7", // keyword (elektryk-tinted)
  "#5bc6f7", // jsx tag
  "#6ee7b7", // check mark
  "#5bc6f7", // "> " prompt / tool name after check
  "#6ee7b7", // GraphQL type after colon
  "#6ec8f7", // CLI flag / "$" prompt sign
  "#f0c674", // function name
];

export function highlightCode(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of code.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) out.push(code.slice(last, start));
    const groupIndex = match.slice(1).findIndex((g) => g !== undefined);
    out.push(
      <span key={key++} style={{ color: TOKEN_COLORS[groupIndex] }}>
        {match[0]}
      </span>,
    );
    last = start + match[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeSnippet({
  code,
  className = "text-[14px] leading-[1.7]",
  caret = false,
}: {
  code: string;
  className?: string;
  caret?: boolean;
}) {
  return (
    <pre
      className={`m-0 font-mono whitespace-pre text-[#e6e8ec] ${className}`}
    >
      {highlightCode(code).map((node, i) => (
        <Fragment key={i}>{node}</Fragment>
      ))}
      {caret && (
        <span
          className="ml-1 inline-block h-4 w-[9px] translate-y-[3px] bg-elektryk"
          style={{ animation: "hero-blink 1s step-end infinite" }}
        />
      )}
    </pre>
  );
}
