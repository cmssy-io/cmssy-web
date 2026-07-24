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
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500",
    iconColor: "text-blue-600",
    titleColor: "text-foreground",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500",
    iconColor: "text-emerald-600",
    titleColor: "text-foreground",
  },
  warning: {
    icon: TriangleAlert,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500",
    iconColor: "text-amber-600",
    titleColor: "text-foreground",
  },
  danger: {
    icon: CircleAlert,
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    accentBg: "bg-red-500/10",
    accentBorder: "border-red-500",
    iconColor: "text-red-600",
    titleColor: "text-foreground",
  },
  note: {
    icon: FileText,
    bg: "bg-muted",
    border: "border-border",
    accentBg: "bg-muted",
    accentBorder: "border-border",
    iconColor: "text-muted-foreground",
    titleColor: "text-foreground",
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
              prose-code:bg-foreground/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
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
