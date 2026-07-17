"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "./site-header";
import { AppSidebar } from "./app-sidebar";
import { MobileNavDrawer } from "./mobile-nav-drawer";

const BARE_ROUTES = ["/login"];

export function AppShell({
  children,
  allowedNavigationGroups,
}: {
  children: React.ReactNode;
  allowedNavigationGroups?: readonly string[];
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <a href="#main-content" className="fixed left-4 top-2 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-bold text-navy shadow-lg transition-transform focus:translate-y-0">
        본문으로 바로가기
      </a>
      <SiteHeader
        onMenuOpen={() => setMobileMenuOpen(true)}
      />
      <MobileNavDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        allowedGroupIds={allowedNavigationGroups}
      />
      <div className="flex min-h-0 flex-1">
        <AppSidebar allowedGroupIds={allowedNavigationGroups} />
        <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col overflow-y-auto bg-canvas outline-none">
          {children}
        </div>
      </div>
    </div>
  );
}
