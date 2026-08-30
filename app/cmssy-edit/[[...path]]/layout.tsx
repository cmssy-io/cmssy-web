import { CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { blocks } from "@/cmssy/blocks";
import { cmssy, type layout } from "@/cmssy/config";
import { splitLocaleFromPath } from "@/lib/locale-path";
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
  const [locales, siteConfig] = await Promise.all([
    resolveSiteLocales(),
    fetchSiteConfig(),
  ]);
  const { locale } = splitLocaleFromPath(path, locales);

  const slot = (region: CmssyRegion<typeof layout>) => (
    <CmssyLayoutSlot
      config={cmssy}
      blocks={blocks}
      region={region}
      page="/"
      path={path ?? []}
      editMode
      editable={EditableLayout}
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
