import "@/styles/main.css";
import {
  fetchLayouts,
  resolveSiteLocales,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { resolveEditorOrigin } from "@cmssy/next";
import { splitCmssyLocale } from "@cmssy/core";
import { CmssyLocaleProvider } from "@cmssy/next/client";
import { cmssy } from "@/cmssy/config";
import { EditableLayout } from "@/cmssy/editable-layout";

async function getDraftLayoutGroups(): Promise<CmssyLayoutGroup[]> {
  try {
    return await fetchLayouts(
      {
        apiUrl: cmssy.apiUrl,
        org: cmssy.org,
        workspaceSlug: cmssy.workspaceSlug,
      },
      "/",
      { previewSecret: cmssy.draftSecret },
    );
  } catch {
    return [];
  }
}

// Editable site chrome for the middleware-rewritten editor route. The route
// itself is force-dynamic, so reading nothing but params here is fine - the
// point of the split is that the PUBLIC layout stays static.
export default async function EditLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const [{ locale }, siteLocales, groups] = await Promise.all([
    splitCmssyLocale(cmssy, path),
    resolveSiteLocales(cmssy),
    getDraftLayoutGroups(),
  ]);
  const resolvedEditorOrigin = resolveEditorOrigin(cmssy.editorOrigin);
  const editorOrigin = Array.isArray(resolvedEditorOrigin)
    ? resolvedEditorOrigin[0]
    : resolvedEditorOrigin;

  const slot = (position: "header" | "footer") => (
    <EditableLayout
      groups={groups}
      position={position}
      locale={locale}
      defaultLocale={siteLocales.defaultLocale}
      enabledLocales={siteLocales.locales}
      edit={{ editorOrigin }}
    />
  );

  // Root layout for the editor route - same reason as the public one: `lang`
  // must be the language the preview is rendering.
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
          {slot("header")}
          {children}
          {slot("footer")}
        </CmssyLocaleProvider>
      </body>
    </html>
  );
}
