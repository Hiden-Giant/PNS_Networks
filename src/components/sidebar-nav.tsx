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
  History,
  Key,
  MapPin,
  Plug,
  Route,
  Settings,
  Ship,
  Users,
} from "./icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
type Child = { href: string; label: string; icon?: IconType };
type Group = {
  id: string;
  label: string;
  description: string;
  icon: IconType;
  href?: string;
  children?: readonly Child[];
};

const GROUPS: readonly Group[] = [
  {
    id: "dashboard",
    label: "메인 대시보드",
    description: "업무 현황과 운영 정보",
    icon: Grid,
    children: [
      { href: "/dashboard", label: "전사 현황", icon: Grid },
      { href: "/dashboard/alerts", label: "운영 알림", icon: ClipboardList },
      { href: "/dashboard/news", label: "물류 뉴스", icon: Globe },
    ],
  },
  {
    id: "master-data",
    label: "기준 정보 관리",
    description: "영업·운임 기준정보",
    icon: Database,
    children: [
      { href: "/master-data/routes", label: "라우트 관리", icon: Route },
      { href: "/master-data/schedules", label: "스케줄 관리", icon: ClipboardList },
      { href: "/master-data/rates", label: "운임·부대비용 관리", icon: Coin },
      { href: "/master-data/customers", label: "고객사·담당자 관리", icon: Users },
      { href: "/master-data/carriers", label: "선사·항공사 관리", icon: Ship },
      { href: "/master-data/locations", label: "지역·항구·공항 관리", icon: MapPin },
      { href: "/master-data/services", label: "서비스·비용 코드 관리", icon: Database },
      { href: "/master-data/users", label: "내부 사용자 관리", icon: Users },
    ],
  },
  {
    id: "schedule",
    label: "스케줄·운임 조회",
    description: "판매 가능한 운송 조회",
    icon: ClipboardList,
    href: "/",
  },
  {
    id: "quotes",
    label: "견적 관리",
    description: "요청부터 승인·발송까지",
    icon: FileText,
    children: [
      { href: "/quote-requests", label: "견적 요청 목록", icon: ClipboardList },
      { href: "/quotations", label: "견적 목록", icon: FileText },
      { href: "/quotations/new", label: "신규 견적 작성", icon: FileText },
      { href: "/templates/quotations", label: "견적 템플릿", icon: Database },
    ],
  },
  {
    id: "integrations",
    label: "연동 관리",
    description: "외부 API 수집·실행 현황",
    icon: Plug,
    children: [
      { href: "/integrations", label: "연동 현황", icon: Plug },
      { href: "/integrations/providers", label: "연동 업체 설정", icon: Settings },
    ],
  },
  {
    id: "settings",
    label: "시스템 설정",
    description: "권한과 감사 로그",
    icon: Settings,
    children: [
      { href: "/settings/permissions", label: "역할·권한 관리", icon: Key },
      { href: "/settings/logs", label: "감사 로그", icon: History },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (["/dashboard", "/quotations", "/integrations"].includes(href)) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({
  onNavigate,
  allowedGroupIds,
}: {
  onNavigate?: () => void;
  allowedGroupIds?: readonly string[];
}) {
  const pathname = usePathname();
  const visibleGroups = allowedGroupIds
    ? GROUPS.filter((group) => allowedGroupIds.includes(group.id))
    : GROUPS;
  const activeGroupIds = visibleGroups
    .filter((group) =>
      group.href
        ? isActive(pathname, group.href)
        : group.children?.some((child) => isActive(pathname, child.href)),
    )
    .map((group) => group.id);
  const [openGroups, setOpenGroups] = useState<string[]>(() => [
    "dashboard",
    ...activeGroupIds,
  ]);

  const toggleGroup = (id: string) => {
    setOpenGroups((current) =>
      current.includes(id)
        ? current.filter((groupId) => groupId !== id)
        : [...current, id],
    );
  };

  return (
    <>
      <nav aria-label="주요 메뉴" className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 pt-4">
        <p className="eyebrow px-2 pb-2 pt-1 !text-white/35">메뉴</p>
        {visibleGroups.map((group) => {
          const GroupIcon = group.icon;

          if (group.href) {
            const active = isActive(pathname, group.href);
            return (
              <Link
                key={group.id}
                href={group.href}
                onClick={onNavigate}
                className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  active
                    ? "bg-brand text-white shadow-lg shadow-brand/20"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <GroupIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{group.label}</span>
                  <span className={`mt-0.5 block text-[11px] leading-tight ${active ? "text-white/70" : "text-white/40"}`}>
                    {group.description}
                  </span>
                </span>
              </Link>
            );
          }

          const expanded = openGroups.includes(group.id);
          const groupActive = group.children?.some((child) => isActive(pathname, child.href));

          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={expanded}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  groupActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <GroupIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-tight">{group.label}</span>
                  <span className={`mt-0.5 block text-[11px] leading-tight ${groupActive ? "text-white/60" : "text-white/40"}`}>
                    {group.description}
                  </span>
                </span>
                <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-white/40 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>

              {expanded && (
                <div className="mb-1 mt-1 space-y-0.5 pl-4">
                  {group.children?.map((child) => {
                    const active = isActive(pathname, child.href);
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={`flex items-center gap-2.5 rounded-lg border-l-2 py-2 pl-3 pr-2 text-sm transition-colors ${
                          active
                            ? "border-brand bg-brand/15 font-semibold text-white"
                            : "border-white/10 text-white/55 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {ChildIcon && <ChildIcon className="h-4 w-4 shrink-0" />}
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

      <div className="space-y-1 border-t border-nav-line p-3">
        <Link
          href="/history"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <History className="h-5 w-5" />
          영업·견적 이력
        </Link>
        <div className="flex items-center gap-3 px-3 pt-2 text-[11px] text-white/30">
          PNS Networks · v1.0
        </div>
      </div>
    </>
  );
}
