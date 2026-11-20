import "@/styles/main.css";
import localFont from "next/font/local";
import { resolveSiteLocales } from "@/services/site";
import { MotionProvider } from "@/components/motion/provider";
import { ThemeProvider } from "@/components/theme";
import { themeInitScript } from "@/lib/theme-script";
import { consentModeInitScript } from "@/lib/consent";
import { Analytics } from "@vercel/analytics/next";

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

/*
 * Self-hosted (app/fonts), not next/font/google: the Google variant downloads
 * the fonts at build time, and a failed download fails the whole production
 * build (it did, on a transient network error). The files are the official
 * google/fonts sources subset to Google's own latin + latin-ext ranges (Polish
 * needs latin-ext), variable axes pinned to wght 400-700 and wdth 100. Licence:
 * SIL OFL 1.1, app/fonts/OFL-*.txt.
 */
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-Variable.woff2",
  weight: "400 700",
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexSans = localFont({
  src: "./fonts/IBMPlexSans-Variable.woff2",
  weight: "400 700",
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/IBMPlexMono-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-mono",
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
        <script
          dangerouslySetInnerHTML={{ __html: consentModeInitScript() }}
        />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
        {/*
         * Vercel Web Analytics: cookieless, so it counts every visitor, not only
         * those who accept the consent banner like PostHog does. Here in the
         * root layout because it never remounts.
         */}
        <Analytics />
      </body>
    </html>
  );
}
