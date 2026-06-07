import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  fetchLayouts,
  CmssyServerLayout,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { isCmssyEditMode } from "@cmssy/next";
import "../styles/main.css";
import { blocks } from "@/cmssy/blocks";
import { cmssy, enabledLocales } from "@/cmssy/config";
import { EditableLayout } from "@/cmssy/editable-layout";
import { buildSiteMetadata } from "@/cmssy/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cmssy",
    ...(await buildSiteMetadata()),
  };
}

function pageSlugFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const defaultLocale = cmssy.defaultLocale ?? "en";
  const nonDefault: readonly string[] = enabledLocales.filter(
    (l) => l !== defaultLocale,
  );
  if (segments[0] && nonDefault.includes(segments[0])) segments.shift();
  return "/" + segments.join("/");
}

async function getLayoutGroups(
  slug: string,
  editMode: boolean,
): Promise<CmssyLayoutGroup[]> {
  try {
    return await fetchLayouts(
      { apiUrl: cmssy.apiUrl, workspaceSlug: cmssy.workspaceSlug },
      slug,
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
  const pathname = (await headers()).get("x-cmssy-path") ?? "/";
  const groups = await getLayoutGroups(pageSlugFromPath(pathname), editMode);
  const locale = (await cmssy.resolveLocale?.()) ?? cmssy.defaultLocale ?? "en";
  const editorOrigin = Array.isArray(cmssy.editorOrigin)
    ? cmssy.editorOrigin[0]
    : cmssy.editorOrigin;

  const sidebarGroup = groups.find((g) => g.position === "sidebar_left");
  const hasSidebar = !!sidebarGroup && sidebarGroup.blocks.length > 0;

  const slot = (position: "header" | "footer" | "sidebar_left") =>
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
        {slot("header")}
        {hasSidebar ? (
          <div className="flex flex-col md:flex-row">
            <div className="md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-border">
              {slot("sidebar_left")}
            </div>
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        ) : (
          children
        )}
        {slot("footer")}
      </body>
    </html>
  );
}
