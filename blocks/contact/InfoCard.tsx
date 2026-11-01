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
      <Icon
        className="mt-0.5 size-5 shrink-0 text-elektryk"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <h3 className="mb-1 font-heading text-[17px] font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
