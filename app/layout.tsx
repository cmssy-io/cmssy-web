import "@/styles/main.css";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { resolveSiteLocales } from "@/services/site";
import { MotionProvider } from "@/components/motion/provider";
import { ThemeProvider } from "@/components/theme";
import { themeInitScript } from "@/lib/theme-script";

/**
 * The real root layout: the document, the fonts, the theme, the motion
 * features.
 *
 * It lives here rather than inside `[[...path]]` because a layout inside a
 * dynamic segment remounts whenever the segment's params change - that is,
 * on every navigation. React then re-acquires `<html>` and `<head>` as
 * singletons and re-inserts their children, which took the stylesheet links
 * out of the document for about a second: the site flashed unstyled white on
 * every click, while a full reload was fine.
 *
 * Everything that depends on the current path - the locale provider, the
 * header and footer, the draft banner - lives in the nested layouts, which may
 * remount as much as they like.
 */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The workspace's own default: `<html lang>` cannot be set from a nested
  // layout, and reading the path here would make every page dynamic. The
  // inline script below corrects it from the URL before the first paint, and
  // LocaleSync keeps it right across client navigation.
  const { defaultLocale, locales } = await resolveSiteLocales();

  return (
    <html
      lang={defaultLocale || undefined}
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript(locales) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
