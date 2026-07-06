// Auto-generated from config.ts
// DO NOT EDIT - This file is automatically regenerated

export interface BlockContent {
  badgeText?: string;
  heading?: string;
  headingHighlight?: string;
  description?: string;
  infoCards?: Array<{
    icon?: "mail" | "clock" | "map-pin" | "phone" | "chat" | "globe";
    title?: string;
    description?: string;
  }>;
  showQuote?: boolean;
  quoteText?: string;
  quoteAuthor?: string;
  submitLoadingText?: string;
  successHeading?: string;
}

export interface BlockAdvanced {
  /** Select a form from the form builder. Fields, messages, and email config come from the form definition. */
  formId?: string;
}
