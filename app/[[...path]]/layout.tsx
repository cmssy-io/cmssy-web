import "@/styles/main.css";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import {
  fetchLayouts,
  resolveSiteLocales,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { fetchSiteConfig } from "@cmssy/core";
import { splitCmssyLocale } from "@cmssy/core";
import { CmssyLocaleProvider } from "@cmssy/next/client";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { blocks } from "@/cmssy/blocks";
import { cmssy } from "@/cmssy/config";
import { DraftPreviewBanner } from "@/components/draft-preview-banner";

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

// Applies the persisted docs theme before first paint (no flash). Docs-scoped:
// only sets data-theme when the user explicitly chose one; default stays light,
// so the light-only marketing surface is never darkened.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('cmssy-docs-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export async function generateMetadata() {
  const siteConfig = await fetchSiteConfig(cmssy).catch(() => null);
  const favicon = siteConfig?.branding?.faviconUrl;
  if (!favicon) return {};
  return { icons: { icon: favicon, apple: favicon } };
}

async function getLayoutGroups(draft: boolean): Promise<CmssyLayoutGroup[]> {
  try {
    return await fetchLayouts(
      {
        apiUrl: cmssy.apiUrl,
        org: cmssy.org,
        workspaceSlug: cmssy.workspaceSlug,
      },
      "/",
      { previewSecret: draft ? cmssy.draftSecret : undefined },
    );
  } catch {
    return [];
  }
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
  const [{ locale }, siteLocales, groups] = await Promise.all([
    splitCmssyLocale(cmssy, path),
    resolveSiteLocales(cmssy),
    getLayoutGroups(draft),
  ]);
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

  const slot = (position: "header" | "footer") => (
    <CmssyServerLayout
      groups={groups}
      blocks={blocks}
      position={position}
      locale={locale}
      defaultLocale={siteLocales.defaultLocale}
      enabledLocales={siteLocales.locales}
    />
  );

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <CmssyLocaleProvider
          value={{
            current: locale,
            default: siteLocales.defaultLocale,
            enabled: siteLocales.locales,
          }}
        >
          {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
          {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
          {slot("header")}
          {children}
          {slot("footer")}
          <DraftPreviewBanner path={path} />
        </CmssyLocaleProvider>
      </body>
    </html>
  );
}
