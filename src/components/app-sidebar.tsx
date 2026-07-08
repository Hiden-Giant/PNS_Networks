import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-nav-line bg-nav text-white lg:flex">
      <SidebarNav />
    </aside>
  );
}
