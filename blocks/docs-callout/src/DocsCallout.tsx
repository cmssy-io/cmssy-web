import {
  Info,
  Lightbulb,
  TriangleAlert,
  CircleAlert,
  FileText,
} from "lucide-react";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

const calloutConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    accentBg: "bg-blue-500/10 dark:bg-blue-500/15",
    accentBorder: "border-blue-500",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-100",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    accentBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    accentBorder: "border-emerald-500",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-emerald-900 dark:text-emerald-100",
  },
  warning: {
    icon: TriangleAlert,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    accentBg: "bg-amber-500/10 dark:bg-amber-500/15",
    accentBorder: "border-amber-500",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-900 dark:text-amber-100",
  },
  danger: {
    icon: CircleAlert,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    accentBg: "bg-red-500/10 dark:bg-red-500/15",
    accentBorder: "border-red-500",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-100",
  },
  note: {
    icon: FileText,
    bg: "bg-zinc-100 dark:bg-zinc-800/50",
    border: "border-zinc-200 dark:border-zinc-700",
    accentBg: "bg-zinc-500/10 dark:bg-zinc-500/15",
    accentBorder: "border-zinc-500",
    iconColor: "text-zinc-600 dark:text-zinc-400",
    titleColor: "text-zinc-900 dark:text-zinc-100",
  },
};

export default function DocsCallout({ content }: { content: BlockContent }) {
  const {
    type = "info",
    style = "card",
    title,
    content: calloutContent = "",
  } = content;

  const config =
    calloutConfig[type as keyof typeof calloutConfig] || calloutConfig.info;
  const Icon = config.icon;

  const wrapperClasses =
    style === "accent-border"
      ? `rounded-r-xl border-l-4 p-6 ${config.accentBg} ${config.accentBorder}`
      : `rounded-lg border p-4 ${config.bg} ${config.border}`;

  return (
    <Container className="py-6">
      <div className={wrapperClasses}>
        <div className="flex gap-3">
          <Icon className={`size-5 mt-0.5 shrink-0 ${config.iconColor}`} />
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className={`font-semibold mb-1 ${config.titleColor}`}>
                {title}
              </h5>
            )}
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground
              prose-p:my-1 prose-p:leading-relaxed
              prose-code:bg-white/50 dark:prose-code:bg-black/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-a:text-inherit prose-a:underline
            "
              dangerouslySetInnerHTML={{ __html: calloutContent }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
