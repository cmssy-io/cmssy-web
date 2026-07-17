import "@/styles/main.css";
import { Space_Grotesk } from "next/font/google";
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

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

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
    <html lang={locale} className={spaceGrotesk.variable}>
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
