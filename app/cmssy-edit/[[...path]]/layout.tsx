import "@/styles/main.css";
import { resolveEditorOrigin } from "@cmssy/next";
import { cmssy } from "@/cmssy/config";
import { splitLocaleFromPath } from "@/lib/locale-path";
import { fetchChromeLayouts } from "@/services/layout";
import { resolveSiteLocales } from "@/services/site";
import { EditableLayout } from "@/cmssy/editable-layout";
import { CmssyLocaleProvider } from "@/components/cmssy-locale";

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
  const [locales, groups] = await Promise.all([
    resolveSiteLocales(),
    fetchChromeLayouts("/", cmssy.draftSecret),
  ]);
  const { locale } = splitLocaleFromPath(path, locales);
  const resolvedEditorOrigin = resolveEditorOrigin(cmssy.editorOrigin);
  const editorOrigin = Array.isArray(resolvedEditorOrigin)
    ? resolvedEditorOrigin[0]
    : resolvedEditorOrigin;

  const slot = (position: "header" | "footer") => (
    <EditableLayout
      groups={groups}
      position={position}
      locale={locale}
      defaultLocale={locales.defaultLocale}
      enabledLocales={locales.locales}
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
            default: locales.defaultLocale,
            enabled: locales.locales,
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
