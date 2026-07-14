import "@/styles/main.css";
import { draftMode } from "next/headers";
import {
  fetchLayouts,
  resolveSiteLocales,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { splitCmssyLocale } from "@cmssy/core";
import { CmssyLocaleProvider } from "@cmssy/next/client";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { blocks } from "@/cmssy/blocks";
import { cmssy } from "@/cmssy/config";

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

// Site chrome for public traffic. Locale comes from route params
// (static-safe) and draft-cookie preview from draftMode() - never from
// headers(), so routes keep their `revalidate` and prerender. The editor
// renders through app/__cmssy/edit, which has its own editable chrome.
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

  // This is the ROOT layout. <html> lives here, not a level up, because `lang`
  // has to be the language the page is actually in - and the language is the
  // path prefix, which only a layout with params can see. Reading it from a
  // header instead would make every route dynamic and lose the ISR that keeps
  // this site fast (CMS-952).
  return (
    <html lang={locale}>
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
        </CmssyLocaleProvider>
      </body>
    </html>
  );
}
