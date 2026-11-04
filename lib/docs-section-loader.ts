import type { DocsSection } from "@/lib/docs-section";

type LoaderContext = {
  page?: { path: string[] } | null;
  locale: { current: string; default: string };
};

export async function loadDocsSectionFor(
  context: LoaderContext | undefined,
): Promise<DocsSection | null> {
  if (!context?.page) return null;
  const { loadDocsSection } = await import("@/lib/docs-section");
  return loadDocsSection(
    context.page.path,
    context.locale.current,
    context.locale.default,
  );
}
