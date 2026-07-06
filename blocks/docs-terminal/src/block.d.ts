// Auto-generated from config.ts
// DO NOT EDIT - This file is automatically regenerated

export interface BlockContent {
  title?: string;
  commands?: Array<{
    prompt?: string;
    command: string;
    output?: string;
  }>;
  showCopyAll?: boolean;
}

export interface BlockStyle {
  theme?: "dark" | "macos" | "minimal" | "clean";
}
