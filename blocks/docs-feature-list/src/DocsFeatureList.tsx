import {
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "../../../components/container";
import { BlockContent } from "./block";

const iconMap: Record<string, LucideIcon> = {
  CheckCircle2,
  Check,
  Sparkles,
  Zap,
  Star,
  Circle,
};

const iconColorMap: Record<string, string> = {
  violet: "text-violet-600 dark:text-violet-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  blue: "text-blue-600 dark:text-blue-400",
  amber: "text-amber-600 dark:text-amber-400",
  foreground: "text-foreground",
};

export default function DocsFeatureList({
  content,
}: {
  content: BlockContent;
}) {
  const {
    heading,
    description,
    icon: defaultIcon = "CheckCircle2",
    iconColor = "violet",
    layout = "stacked",
    items = [],
  } = content;

  const iconColorClass = iconColorMap[iconColor] || iconColorMap.violet;
  const listGridClass =
    layout === "grid-2"
      ? "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"
      : "space-y-4";

  return (
    <Container className="py-6">
      {(heading || description) && (
        <div className="mb-6">
          {heading && (
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {heading}
            </h3>
          )}
          {description && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <ul className={listGridClass}>
        {items.map((item, index) => {
          const iconName = item.icon || defaultIcon;
          const Icon = iconMap[iconName] || CheckCircle2;
          return (
            <li key={index} className="flex items-start gap-3">
              <Icon
                className={`size-5 shrink-0 mt-0.5 ${iconColorClass}`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <span className="text-base text-foreground leading-relaxed">
                  {item.title}
                </span>
                {item.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
