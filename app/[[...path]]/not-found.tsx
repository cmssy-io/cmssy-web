import { CmssyServerPage } from "@cmssy/react";
import { cmssy } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { getPageById, getSiteConfig, siteLocales } from "@/cmssy/site";
import { CmssyLocaleProvider } from "@/components/cmssy-locale";

function DefaultNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="opacity-70">Page not found</p>
    </main>
  );
}

// Renders the workspace's configured 404 page (Settings -> 404 page). The 404
// path is itself a fallback, so any backend hiccup degrades to the built-in
// message rather than a 500.
export default async function NotFound() {
  const config = await getSiteConfig();
  const notFoundPageId = config?.notFoundPageId;
  if (!notFoundPageId) return <DefaultNotFound />;

  const page = await getPageById(notFoundPageId);
  if (!page || page.blocks.length === 0) return <DefaultNotFound />;

  const { defaultLocale, locales } = siteLocales(config);

  return (
    <CmssyLocaleProvider
      value={{
        current: defaultLocale,
        default: defaultLocale,
        enabled: locales,
      }}
    >
      <CmssyServerPage
        page={page}
        blocks={blocks}
        locale={defaultLocale}
        defaultLocale={defaultLocale}
        enabledLocales={locales}
        config={cmssy}
      />
    </CmssyLocaleProvider>
  );
}
