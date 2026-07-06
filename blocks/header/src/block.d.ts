// Auto-generated from config.ts
// DO NOT EDIT - This file is automatically regenerated

export interface BlockContent {
  logo?: string;
  logoText?: string;
  navigation?: Array<{
    label: string;
    url?: string;
    openInNewTab?: boolean;
    columns?: "none" | "1" | "2" | "3";
    children?: Array<{
      label: string;
      description?: string;
      url: string;
      icon?: string;
      openInNewTab?: boolean;
    }>;
  }>;
  showCta?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaStyle?: "primary" | "secondary" | "outline";
  showSecondaryCta?: boolean;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  secondaryCtaStyle?: "ghost" | "outline" | "link";
  sticky?: boolean;
  logoutButtonText?: string;
  showLanguageSwitcher?: boolean;
  showAnnouncement?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementDismissible?: boolean;
}

export interface BlockStyle {
  logoSize?: "sm" | "md" | "lg";
  transparent?: boolean;
  announcementBg?: string;
  announcementTextColor?: string;
}
