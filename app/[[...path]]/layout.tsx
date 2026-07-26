import { draftMode } from "next/headers";
import { CmssyServerLayout } from "@cmssy/react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { blocks } from "@/cmssy/blocks";
import { cmssy } from "@/cmssy/config";
import { splitLocaleFromPath } from "@/lib/locale-path";
import { fetchChromeLayouts } from "@/services/layout";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";
import { CmssyLocaleProvider, LocaleSync } from "@/components/cmssy-locale";
import { DraftPreviewBanner } from "@/components/draft-preview-banner";

// The document itself is in app/layout.tsx, which never remounts. This layout
// carries what depends on the path: the locale, the header and the footer.
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
  const [locales, groups, siteConfig] = await Promise.all([
    resolveSiteLocales(),
    fetchChromeLayouts("/", draft ? cmssy.draftSecret : undefined),
    fetchSiteConfig(),
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
      // The header picks its mark by theme, and only the workspace knows
      // whether it has a dark one.
      appContext={{ branding: siteConfig?.branding ?? null }}
    />
  );

  return (
    <CmssyLocaleProvider
      value={{
        current: locale,
        default: locales.defaultLocale,
        enabled: locales.locales,
      }}
    >
      <LocaleSync />
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      {slot("header")}
      {children}
      {slot("footer")}
      <DraftPreviewBanner path={path} />
    </CmssyLocaleProvider>
  );
}
