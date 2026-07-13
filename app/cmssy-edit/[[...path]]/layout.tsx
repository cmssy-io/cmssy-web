import {
  fetchLayouts,
  resolveSiteLocales,
  type CmssyLayoutGroup,
} from "@cmssy/react";
import { resolveEditorOrigin, splitCmssyLocale } from "@cmssy/next";
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

  return (
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
  );
}
