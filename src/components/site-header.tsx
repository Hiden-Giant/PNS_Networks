"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { Bell, Box, Menu, Plus, Search, User } from "./icons";

const NAV = [
  { label: "스케줄·운임 조회", href: "/" },
  { label: "견적 관리", href: "/quotations" },
  { label: "영업·견적 이력", href: "/history" },
] as const;

export function SiteHeader({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-nav text-white">
      <div className="flex h-14 items-center gap-3 border-b border-nav-line px-4 lg:gap-6 lg:px-6">
        <button type="button" aria-label="메뉴 열기" onClick={onMenuOpen} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white"><Box className="h-5 w-5" /></span>
          <span className="text-lg font-black tracking-tight">PNS <span className="font-medium text-white/80">Networks</span></span>
        </Link>

        <nav aria-label="빠른 메뉴" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`data relative py-4 text-sm transition-colors ${active ? "font-semibold text-white" : "text-white/50 hover:text-white/80"}`}>
                {item.label}
                {active && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-brand" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden max-w-sm flex-1 items-center gap-2 rounded-lg border border-nav-line bg-white/5 px-3 py-2 sm:flex">
          <Search className="h-4 w-4 text-white/40" />
          <input type="search" aria-label="통합 검색" placeholder="스케줄·견적번호 검색" className="data w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none" />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:ml-0 sm:gap-3">
          <button type="button" aria-label="알림" className="relative text-white/70 transition-colors hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand ring-2 ring-nav" />
          </button>
          <form action={logout}>
            <button type="submit" aria-label="로그아웃" title="로그아웃" className="flex h-8 w-8 items-center justify-center rounded-full border border-nav-line text-white/70 transition-colors hover:text-white">
              <User className="h-5 w-5" />
            </button>
          </form>
          <Link href="/quotations/new" className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline">신규 견적</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
