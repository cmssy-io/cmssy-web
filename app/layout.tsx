import type { Metadata } from "next";
import {
  fetchLayouts,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { isCmssyEditMode } from "@cmssy/next";
import { CmssyLocaleProvider } from "@cmssy/next/client";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "../styles/main.css";
import { blocks } from "@/cmssy/blocks";
import { cmssy, enabledLocales } from "@/cmssy/config";
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
  const groups = await getLayoutGroups(editMode);
  const locale = (await cmssy.resolveLocale?.()) ?? cmssy.defaultLocale ?? "en";
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const editorOrigin = Array.isArray(cmssy.editorOrigin)
    ? cmssy.editorOrigin[0]
    : cmssy.editorOrigin;

  const slot = (position: "header" | "footer") =>
    editMode ? (
      <EditableLayout
        groups={groups}
        position={position}
        locale={locale}
        defaultLocale={cmssy.defaultLocale ?? "en"}
        enabledLocales={[...enabledLocales]}
        edit={{ editorOrigin }}
      />
    ) : (
      <CmssyServerLayout
        groups={groups}
        blocks={blocks}
        position={position}
        locale={locale}
        defaultLocale={cmssy.defaultLocale ?? "en"}
        enabledLocales={[...enabledLocales]}
      />
    );

  return (
    <html lang={locale}>
      <body>
        <CmssyLocaleProvider
          value={{
            current: locale,
            default: cmssy.defaultLocale ?? "en",
            enabled: [...enabledLocales],
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
