import "@/styles/main.css";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { CmssyServerLayout } from "@cmssy/react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { blocks } from "@/cmssy/blocks";
import { cmssy } from "@/cmssy/config";
import { splitLocaleFromPath } from "@/lib/locale-path";
import { fetchChromeLayouts } from "@/services/layout";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";
import { CmssyLocaleProvider } from "@/components/cmssy-locale";
import { DraftPreviewBanner } from "@/components/draft-preview-banner";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme";

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

export async function generateMetadata() {
  const siteConfig = await fetchSiteConfig();
  const favicon = siteConfig?.branding?.faviconUrl;
  if (!favicon) return {};
  return { icons: { icon: favicon, apple: favicon } };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const { isEnabled: draft } = await draftMode();
  const [locales, groups] = await Promise.all([
    resolveSiteLocales(),
    fetchChromeLayouts("/", draft ? cmssy.draftSecret : undefined),
  ]);
  const { locale } = splitLocaleFromPath(path, locales);
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

  const slot = (position: "header" | "footer") => (
    <CmssyServerLayout
      groups={groups}
      blocks={blocks}
      position={position}
      locale={locale}
      defaultLocale={locales.defaultLocale}
      enabledLocales={locales.locales}
    />
  );

  return (
    <html
      lang={locale || undefined}
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <CmssyLocaleProvider
          value={{
            current: locale,
            default: locales.defaultLocale,
            enabled: locales.locales,
          }}
        >
          <ThemeProvider>
            {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
            {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
            {slot("header")}
            {children}
            {slot("footer")}
            <DraftPreviewBanner path={path} />
          </ThemeProvider>
        </CmssyLocaleProvider>
      </body>
    </html>
  );
}
