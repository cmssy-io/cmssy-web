import { DocsSidebarNav } from "@/components/docs-sidebar-nav";
import type { DocsSection } from "@/lib/docs-section";

export default function DocsSidebar({ data }: { data?: DocsSection | null }) {
  if (!data?.area) return null;
  return <DocsSidebarNav area={data.area} sections={data.nav} ui={data.ui} />;
}
