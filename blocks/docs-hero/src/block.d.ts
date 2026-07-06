// Auto-generated from config.ts
// DO NOT EDIT - This file is automatically regenerated

export interface BlockContent {
  badge?: string;
  heading: string;
  description?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  quickLinks?: Array<{
    /** Lucide icon name */
    icon?: string;
    title: string;
    description?: string;
    url: string;
  }>;
}

export interface BlockStyle {
  variant?: "default" | "gradient" | "minimal";
}
