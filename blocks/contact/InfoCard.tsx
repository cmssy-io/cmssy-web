import {
  Clock,
  Globe,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  clock: Clock,
  "map-pin": MapPin,
  phone: Phone,
  chat: MessageCircle,
  globe: Globe,
};

const FALLBACK_ICONS: LucideIcon[] = [Mail, Clock, MapPin];

interface InfoCardProps {
  icon?: string;
  title?: string;
  description?: string;
  index: number;
}

export function InfoCard({ icon, title, description, index }: InfoCardProps) {
  const Icon =
    (icon && ICON_MAP[icon]) || FALLBACK_ICONS[index % FALLBACK_ICONS.length];

  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
