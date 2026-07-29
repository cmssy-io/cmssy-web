import { resolveEditorOrigin } from "@cmssy/next";
import { cmssy } from "@/cmssy/config";
import { splitLocaleFromPath } from "@/lib/locale-path";
import { fetchChromeLayouts } from "@/services/layout";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";
import { EditableLayout } from "@/cmssy/editable-layout";
import { CmssyLocaleProvider, LocaleSync } from "@/components/cmssy-locale";

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
  const [locales, groups, siteConfig] = await Promise.all([
    resolveSiteLocales(),
    fetchChromeLayouts("/", cmssy.draftSecret),
    fetchSiteConfig(),
  ]);
  const { locale } = splitLocaleFromPath(path, locales);
  const editorOrigin = resolveEditorOrigin(cmssy.editorOrigin);

  const slot = (position: "header" | "footer") => (
    <EditableLayout
      groups={groups}
      position={position}
      locale={locale}
      defaultLocale={locales.defaultLocale}
      enabledLocales={locales.locales}
      edit={{ editorOrigin }}
      appContext={{ branding: siteConfig?.branding ?? null }}
    />
  );

  // The document and the theme provider come from app/layout.tsx, the same as
  // for the public route - the editor renders the same blocks and needs the
  // same providers around them.
  return (
    <CmssyLocaleProvider
      value={{
        current: locale,
        default: locales.defaultLocale,
        enabled: locales.locales,
      }}
    >
      <LocaleSync />
      {slot("header")}
      {children}
      {slot("footer")}
    </CmssyLocaleProvider>
  );
}
