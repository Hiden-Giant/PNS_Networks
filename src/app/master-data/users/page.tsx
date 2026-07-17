"use client";

import { ManagementListPage } from "@/components/management-list-page";
import { Users } from "@/components/icons";

export default function UsersPage() {
  return <ManagementListPage icon={Users} title="내부 사용자 관리" description="플랫폼 사용자와 역할, 계정 상태를 관리합니다." registerLabel="사용자 등록" searchPlaceholder="이름, 이메일, 부서 검색" columns={["사용자", "이메일", "부서", "역할", "최근 접속"]} rows={[
    { id: "USR-001", cells: ["관리자", "admin@pns.co.kr", "IT", "시스템 관리자", "오늘 09:12"], status: { label: "활성", tone: "success" } },
    { id: "USR-002", cells: ["김민준", "sales@pns.co.kr", "영업", "영업 관리자", "어제 17:45"], status: { label: "활성", tone: "success" } },
    { id: "USR-003", cells: ["박지훈", "rate@pns.co.kr", "운임", "운임 관리자", "7일 전"], status: { label: "휴면 검토", tone: "warning" } },
  ]} />;
}
