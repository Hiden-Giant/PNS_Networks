import { SidebarNav } from "./sidebar-nav";

export function AppSidebar({
  allowedGroupIds,
}: {
  allowedGroupIds?: readonly string[];
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-nav-line bg-nav text-white lg:flex">
      <SidebarNav allowedGroupIds={allowedGroupIds} />
    </aside>
  );
}
