import { draftMode } from "next/headers";
import { CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { blocks } from "@/cmssy/blocks";
import { cmssy, type layout } from "@/cmssy/config";
import { EditableLayout } from "@/cmssy/editable-layout";
import { splitLocaleFromPath } from "@/lib/locale-path";
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
  const [locales, siteConfig] = await Promise.all([
    resolveSiteLocales(),
    fetchSiteConfig(),
  ]);
  const { locale } = splitLocaleFromPath(path, locales);
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

  // Site chrome comes from the root page's layouts, whatever route is open;
  // `path` only says which language to render it in.
  const slot = (position: CmssyRegion<typeof layout>) => (
    <CmssyLayoutSlot
      config={cmssy}
      blocks={blocks}
      position={position}
      page="/"
      path={path ?? []}
      editMode={false}
      preview={draft}
      editable={EditableLayout}
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
      <div className="contents [&>[data-block-type]]:contents">
        {slot("header")}
      </div>
      {children}
      {slot("footer")}
      <DraftPreviewBanner path={path} />
    </CmssyLocaleProvider>
  );
}
