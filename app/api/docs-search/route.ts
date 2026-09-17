import { NextResponse, type NextRequest } from "next/server";
import { loadDocsSearchBodies } from "@/services/docs-search";
import { resolveSiteLocales } from "@/services/site";

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("locale");
  const { defaultLocale, locales } = await resolveSiteLocales();
  const locale =
    requested && locales.includes(requested) ? requested : defaultLocale;

  try {
    const entries = await loadDocsSearchBodies(locale, defaultLocale);
    return NextResponse.json(
      { locale, entries },
      {
        headers: {
          "cache-control":
            "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("[cmssy-web] docs search index could not be built", error);
    return NextResponse.json({ locale, entries: [] });
  }
}
