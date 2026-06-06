import dynamic from "next/dynamic";
import { createCmssyPage } from "@cmssy/next";
import { cmssy, enabledLocales } from "@/cmssy/config";
import { blocks } from "@/cmssy/blocks";
import { buildPageMetadata } from "@/cmssy/metadata";

// ISR: pages are statically cached and revalidated on a timer; the
// /api/revalidate webhook invalidates on publish for on-demand freshness.
// Cache stays per-path (e.g. /about vs /pl/about) because we never rewrite.
export const revalidate = 3600;
export const dynamicParams = true;

const CmssyEditor = dynamic(() =>
  import("@/cmssy/editor").then((m) => m.CmssyEditor),
);

const renderPage = createCmssyPage(cmssy, blocks, { editor: CmssyEditor });

// Drop a leading non-default locale segment (e.g. ["pl","about"] -> ["about"])
// so the SDK queries the real cmssy slug. The active locale is resolved from
// the x-cmssy-locale header set in proxy.ts, not from the path.
const nonDefaultLocales: readonly string[] = enabledLocales.filter(
  (l) => l !== cmssy.defaultLocale,
);

function stripLocale(path: string[] | undefined): string[] | undefined {
  const first = path?.[0];
  if (first && nonDefaultLocales.includes(first)) {
    return path!.slice(1);
  }
  return path;
}

type PageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps) {
  const { path } = await params;
  return buildPageMetadata(stripLocale(path));
}

export default function Page({ params, searchParams }: PageProps) {
  const stripped = params.then((p) => ({ ...p, path: stripLocale(p.path) }));
  return renderPage({ params: stripped, searchParams });
}
