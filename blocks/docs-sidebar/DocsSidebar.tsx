import { DocsSidebarNav } from "@/components/docs-sidebar-nav";
import type { DocsSection } from "@/lib/docs-section";

export default function DocsSidebar({ data }: { data?: DocsSection | null }) {
  if (!data) return null;
  return (
    <DocsSidebarNav
      root={data.root}
      sections={data.nav}
      searchItems={data.searchItems}
      ui={data.ui}
    />
  );
}
