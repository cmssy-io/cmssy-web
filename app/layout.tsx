import type { Metadata } from "next";
import {
  fetchLayouts,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { isCmssyEditMode } from "@cmssy/next";
import "../styles/main.css";
import { blocks } from "@/cmssy/blocks";
import { cmssy } from "@/cmssy/config";
import { EditableLayout } from "@/cmssy/editable-layout";

export const metadata: Metadata = {
  title: "Cmssy",
};

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
        edit={{ editorOrigin }}
      />
    ) : (
      <CmssyServerLayout
        groups={groups}
        blocks={blocks}
        position={position}
        locale={locale}
        defaultLocale={cmssy.defaultLocale ?? "en"}
      />
    );

  return (
    <html lang={locale}>
      <body>
        {slot("header")}
        {children}
        {slot("footer")}
      </body>
    </html>
  );
}
