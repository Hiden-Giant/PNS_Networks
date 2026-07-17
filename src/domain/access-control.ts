export const MENU_RESOURCES = [
  { id: "dashboard", label: "메인 대시보드" },
  { id: "masterData", label: "기준 정보 관리" },
  { id: "schedule", label: "스케줄·운임 조회" },
  { id: "quotes", label: "견적 관리" },
  { id: "integrations", label: "연동 관리" },
  { id: "settings", label: "시스템 설정" },
] as const;

export type MenuResourceId = (typeof MENU_RESOURCES)[number]["id"];

export const ROLE_DEFINITIONS = [
  {
    id: "system-admin",
    name: "시스템 관리자",
    description: "사용자, 권한, 코드북과 시스템 설정을 관리합니다.",
    menuAccess: ["dashboard", "masterData", "schedule", "quotes", "integrations", "settings"],
  },
  {
    id: "rate-manager",
    name: "운임 관리자",
    description: "라우트, 스케줄, 원가, 부대비용과 마진 규칙을 관리합니다.",
    menuAccess: ["dashboard", "masterData", "schedule", "quotes"],
  },
  {
    id: "sales-manager",
    name: "영업 관리자",
    description: "고객, 견적, 할인 승인과 영업 현황을 관리합니다.",
    menuAccess: ["dashboard", "masterData", "schedule", "quotes"],
  },
  {
    id: "sales-representative",
    name: "영업 담당자",
    description: "스케줄과 판매가를 조회하고 고객 견적을 작성합니다.",
    menuAccess: ["dashboard", "schedule", "quotes"],
  },
  {
    id: "operations",
    name: "운영 담당자",
    description: "스케줄 상태와 외부 연동 결과를 확인하고 정정합니다.",
    menuAccess: ["dashboard", "masterData", "schedule", "integrations"],
  },
  {
    id: "auditor",
    name: "감사·조회 사용자",
    description: "허용된 업무 데이터와 감사 로그를 읽기 전용으로 확인합니다.",
    menuAccess: ["dashboard", "schedule", "settings"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  description: string;
  menuAccess: readonly MenuResourceId[];
}>;

export type RoleId = (typeof ROLE_DEFINITIONS)[number]["id"];

export function canAccessMenu(
  role: (typeof ROLE_DEFINITIONS)[number],
  resource: MenuResourceId,
) {
  return (role.menuAccess as readonly MenuResourceId[]).includes(resource);
}
