import { draftMode } from "next/headers";
import { CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { blocks } from "@/cmssy/blocks";
import { cmssy, type layout } from "@/cmssy/config";
import { EditableLayout } from "@/cmssy/editable-layout";
import { pickLocalized, splitLocaleFromPath } from "@/lib/locale-path";
import { CONTENT_CACHE } from "@/services/pages";
import { fetchSiteConfig, resolveSiteLocales } from "@/services/site";
import { CmssyLocaleProvider, LocaleSync } from "@/components/cmssy-locale";
import { DraftPreviewBanner } from "@/components/draft-preview-banner";
import { Analytics } from "@/components/analytics";
import { ADMIN_URL } from "@/lib/admin-url";
import { siteUrl } from "@/lib/site-url";
import { JsonLd } from "@/components/json-ld";

// What AI answers and search engines read as "who is cmssy". Keep it identical
// to the fact sheet one-liner and to every public profile.
const ORG_DESCRIPTION =
  "Headless CMS with built-in commerce that an AI agent can run. Your own Next.js, Astro or Remix app renders the content; cmssy never hosts your site.";
// Public profiles of the same entity.
const SAME_AS = [
  "https://x.com/cmssy_io",
  "https://www.linkedin.com/company/cmssy/",
  "https://www.youtube.com/@cmssy",
  "https://github.com/cmssy-io",
  "https://www.npmjs.com/package/@cmssy/mcp-server",
];

// The document itself is in app/layout.tsx, which never remounts. This layout
// carries what depends on the path: the locale, the header and the footer.
export async function generateMetadata() {
  const siteConfig = await fetchSiteConfig();
  const favicon = siteConfig?.branding?.faviconUrl;
  if (!favicon) return {};
  return { icons: { icon: favicon, apple: favicon } };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const { isEnabled: draft } = await draftMode();
  const [locales, siteConfig] = await Promise.all([
    resolveSiteLocales(),
    fetchSiteConfig(),
  ]);
  const { locale } = splitLocaleFromPath(path, locales);
  const base = siteUrl();
  const brandName =
    pickLocalized(siteConfig?.siteName, locale, locales.defaultLocale) ||
    siteConfig?.branding?.brandName ||
    "";
  const logoUrl = siteConfig?.branding?.logoUrl;
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

  // Site chrome comes from the root page's layouts, whatever route is open;
  // `path` only says which language to render it in.
  const slot = (region: CmssyRegion<typeof layout>) => (
    <CmssyLayoutSlot
      config={cmssy}
      blocks={blocks}
      region={region}
      page="/"
      path={path ?? []}
      editMode={false}
      preview={draft}
      editable={EditableLayout}
      cache={CONTENT_CACHE}
      // The header picks its mark by theme, and only the workspace knows
      // whether it has a dark one.
      appContext={{ branding: siteConfig?.branding ?? null }}
    />
  );

  return (
    <CmssyLocaleProvider
      value={{
        current: locale,
        default: locales.defaultLocale,
        enabled: locales.locales,
      }}
    >
      <LocaleSync />
      {brandName && base ? (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: brandName,
              url: base,
              ...(logoUrl ? { logo: logoUrl } : {}),
              description: ORG_DESCRIPTION,
              email: "contact@cmssy.com",
              sameAs: SAME_AS,
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: brandName,
              url: base,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              description: ORG_DESCRIPTION,
              // The free Hobby plan; paid tiers live on /pricing and change
              // there, so only the stable "free to start" fact is stated here.
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }}
          />
        </>
      ) : null}
      <Analytics gaId={gaId} gtmId={gtmId} appUrl={ADMIN_URL} />
      <div className="contents [&>[data-block-type]]:contents">
        {slot("header")}
      </div>
      {children}
      {slot("footer")}
      <DraftPreviewBanner path={path} />
    </CmssyLocaleProvider>
  );
}
