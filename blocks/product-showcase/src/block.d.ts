export interface BlockContent {
  badgeText?: string;
  heading: string;
  headingHighlight?: string;
  description?: string;
  items?: Array<{
    image?: string;
    title: string;
    caption?: string;
  }>;
}
