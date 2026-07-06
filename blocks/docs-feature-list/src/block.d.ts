// Auto-generated from config.ts
// DO NOT EDIT - This file is automatically regenerated

export interface BlockContent {
  heading?: string;
  description?: string;
  icon?: "CheckCircle2" | "Check" | "Sparkles" | "Zap" | "Star" | "Circle";
  iconColor?: "violet" | "emerald" | "blue" | "amber" | "foreground";
  items?: Array<{
    title: string;
    description?: string;
    icon?: "CheckCircle2" | "Check" | "Sparkles" | "Zap" | "Star" | "Circle";
  }>;
}

export interface BlockStyle {
  layout?: "stacked" | "grid-2";
}
