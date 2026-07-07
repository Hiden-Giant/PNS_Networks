"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { AppSidebar } from "./app-sidebar";

const BARE_ROUTES = ["/login"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SiteHeader />
      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-y-auto bg-canvas">
          {children}
        </div>
      </div>
    </div>
  );
}
