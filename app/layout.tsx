import type { Metadata } from "next";
import {
  fetchLayouts,
  resolveSiteLocales,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import {
  getCmssyLocale,
  isCmssyEditMode,
  resolveEditorOrigin,
} from "@cmssy/next";
import { CmssyLocaleProvider } from "@cmssy/next/client";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "../styles/main.css";
import { blocks } from "@/cmssy/blocks";
import { cmssy } from "@/cmssy/config";
import { EditableLayout } from "@/cmssy/editable-layout";
import { buildSiteMetadata } from "@/cmssy/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata();
}

async function getLayoutGroups(editMode: boolean): Promise<CmssyLayoutGroup[]> {
  try {
    return await fetchLayouts(
      { apiUrl: cmssy.apiUrl, workspaceSlug: cmssy.workspaceSlug },
      "/",
      { previewSecret: editMode ? cmssy.draftSecret : undefined },
    );
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const editMode = await isCmssyEditMode();
  const [groups, locale, siteLocales] = await Promise.all([
    getLayoutGroups(editMode),
    getCmssyLocale(cmssy),
    resolveSiteLocales(cmssy),
  ]);
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const resolvedEditorOrigin = resolveEditorOrigin(cmssy.editorOrigin);
  const editorOrigin = Array.isArray(resolvedEditorOrigin)
    ? resolvedEditorOrigin[0]
    : resolvedEditorOrigin;

  const slot = (position: "header" | "footer") =>
    editMode ? (
      <EditableLayout
        groups={groups}
        position={position}
        locale={locale}
        defaultLocale={siteLocales.defaultLocale}
        enabledLocales={siteLocales.locales}
        edit={{ editorOrigin }}
      />
    ) : (
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
    <html lang={locale}>
      <body>
        <CmssyLocaleProvider
          value={{
            current: locale,
            default: siteLocales.defaultLocale,
            enabled: siteLocales.locales,
          }}
        >
          {!editMode && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
          {!editMode && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
          {slot("header")}
          {children}
          {slot("footer")}
        </CmssyLocaleProvider>
      </body>
    </html>
  );
}
