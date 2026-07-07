"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  ChevronDown,
  ClipboardList,
  Coin,
  Database,
  FileText,
  Globe,
  Grid,
  Key,
  LifeBuoy,
  MapPin,
  Plug,
  Route,
  Settings,
} from "./icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type Child = { href: string; label: string };
type Group = {
  id: string;
  label: string;
  desc: string;
  icon: IconType;
  href?: string;
  children?: Child[];
};

const GROUPS: Group[] = [
  {
    id: "dashboard",
    label: "메인 대시보드",
    desc: "시스템 현황 및 뉴스 제공",
    icon: Grid,
    children: [
      { href: "/dashboard", label: "전사 현황" },
      { href: "/dashboard/alerts", label: "운영 알림" },
      { href: "/dashboard/news", label: "물류 뉴스" },
    ],
  },
  {
    id: "master-data",
    label: "기준 정보 관리",
    desc: "라우트·스케줄·운임 관리",
    icon: Database,
    children: [
      { href: "/master-data/routes", label: "라우트 관리" },
      { href: "/master-data/schedules", label: "스케줄 관리" },
      { href: "/master-data/rates", label: "운임 관리" },
    ],
  },
  {
    id: "schedule",
    label: "스케줄 조회",
    desc: "이용자 스케줄 및 요율 조회",
    icon: ClipboardList,
    href: "/",
  },
  {
    id: "quotes",
    label: "견적 관리",
    desc: "견적 요청 및 문의 관리",
    icon: FileText,
    children: [
      { href: "/quote-requests", label: "견적 요청 목록" },
      { href: "/quotations", label: "견적 문의 작성" },
    ],
  },
  {
    id: "integrations",
    label: "연동 관리",
    desc: "API 연동 현황 모니터링",
    icon: Plug,
    children: [{ href: "/integrations", label: "API 연동 현황 모니터링" }],
  },
  {
    id: "settings",
    label: "시스템 설정",
    desc: "이용자 권한 관리 및 로그 조회",
    icon: Settings,
    children: [
      { href: "/settings/permissions", label: "권한 관리" },
      { href: "/settings/logs", label: "로그 관리" },
    ],
  },
];

const CHILD_ICONS: Record<string, IconType> = {
  "/master-data/routes": Route,
  "/master-data/schedules": ClipboardList,
  "/master-data/rates": Coin,
  "/quote-requests": FileText,
  "/quotations": MapPin,
  "/settings/permissions": Key,
  "/settings/logs": Globe,
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function AppSidebar() {
  const pathname = usePathname();

  const initiallyOpen = GROUPS.filter((g) =>
    g.children?.some((c) => isActive(pathname, c.href)),
  ).map((g) => g.id);
  const [open, setOpen] = useState<string[]>(
    initiallyOpen.length ? initiallyOpen : ["dashboard"],
  );

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-nav-line bg-nav text-white lg:flex">
      {/* Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-4">
        <p className="eyebrow px-2 pb-2 pt-1 !text-white/35">메뉴</p>

        {GROUPS.map((group) => {
          const Icon = group.icon;

          // Single-link group (no children)
          if (!group.children) {
            const active = isActive(pathname, group.href!);
            return (
              <Link
                key={group.id}
                href={group.href!}
                className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  active
                    ? "bg-brand text-white shadow-lg shadow-brand/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">
                    {group.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-[11px] leading-tight ${
                      active ? "text-white/70" : "text-white/40"
                    }`}
                  >
                    {group.desc}
                  </span>
                </span>
              </Link>
            );
          }

          const expanded = open.includes(group.id);
          const groupActive = group.children.some((c) =>
            isActive(pathname, c.href),
          );

          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggle(group.id)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  groupActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-tight">
                    {group.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-[11px] leading-tight ${
                      groupActive ? "text-white/60" : "text-white/40"
                    }`}
                  >
                    {group.desc}
                  </span>
                </span>
                <ChevronDown
                  className={`mt-0.5 h-4 w-4 shrink-0 text-white/40 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded && (
                <div className="mb-1 mt-1 space-y-0.5 pl-4">
                  {group.children.map((child) => {
                    const active = isActive(pathname, child.href);
                    const ChildIcon = CHILD_ICONS[child.href];
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2.5 rounded-lg border-l-2 py-2 pl-3 pr-2 text-sm transition-colors ${
                          active
                            ? "border-brand bg-brand/15 font-semibold text-white"
                            : "border-white/10 text-white/55 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {ChildIcon ? (
                          <ChildIcon className="h-4 w-4 shrink-0" />
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              active ? "bg-brand" : "bg-white/30"
                            }`}
                          />
                        )}
                        <span className="truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom utilities */}
      <div className="space-y-1 border-t border-nav-line p-3">
        <Link
          href="/history"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LifeBuoy className="h-5 w-5" />
          고객 지원
        </Link>
        <div className="flex items-center gap-3 px-3 pt-2 text-[11px] text-white/30">
          PNS Networks · v1.0
        </div>
      </div>
    </aside>
  );
}
