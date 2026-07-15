import {
  Info,
  Lightbulb,
  TriangleAlert,
  CircleAlert,
  FileText,
} from "lucide-react";
import type { BlockProps } from "@cmssy/react";
import { Container } from "@/components/container";
import type { docsCalloutProps } from "./block";

const calloutConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500",
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-900",
  },
  warning: {
    icon: TriangleAlert,
    bg: "bg-amber-50",
    border: "border-amber-200",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
  },
  danger: {
    icon: CircleAlert,
    bg: "bg-red-50",
    border: "border-red-200",
    accentBg: "bg-red-500/10",
    accentBorder: "border-red-500",
    iconColor: "text-red-600",
    titleColor: "text-red-900",
  },
  note: {
    icon: FileText,
    bg: "bg-zinc-100",
    border: "border-zinc-200",
    accentBg: "bg-zinc-500/10",
    accentBorder: "border-zinc-500",
    iconColor: "text-zinc-600",
    titleColor: "text-zinc-900",
  },
};

export default function DocsCallout({
  content,
}: BlockProps<typeof docsCalloutProps>) {
  const {
    type = "info",
    style: calloutStyle = "card",
    title,
    content: calloutContent = "",
  } = content;

  const config =
    calloutConfig[type as keyof typeof calloutConfig] || calloutConfig.info;
  const Icon = config.icon;

  const wrapperClasses =
    calloutStyle === "accent-border"
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
              className="prose prose-sm max-w-none text-muted-foreground
              prose-p:my-1 prose-p:leading-relaxed
              prose-code:bg-white/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
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
