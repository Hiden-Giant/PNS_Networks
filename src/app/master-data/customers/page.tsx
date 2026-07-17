"use client";

import { ManagementListPage } from "@/components/management-list-page";
import { Users } from "@/components/icons";

export default function CustomersPage() {
  return <ManagementListPage icon={Users} title="고객사·담당자 관리" description="고객사 기본정보와 영업·고객 담당자를 관리합니다." registerLabel="고객사 등록" searchPlaceholder="고객사명, 사업자번호, 담당자 검색" columns={["고객사 코드", "고객사명", "국가", "영업 담당자", "고객 담당자"]} rows={[
    { id: "CUS-001", cells: ["CUS-001", "PNS Trading", "KR", "김민준", "이서연"], status: { label: "거래 중", tone: "success" } },
    { id: "CUS-002", cells: ["CUS-002", "Hanul Parts", "KR", "박지훈", "최유진"], status: { label: "거래 중", tone: "success" } },
    { id: "CUS-003", cells: ["CUS-003", "Tokyo Bridge", "JP", "정하늘", "Sato Ken"], status: { label: "검토", tone: "warning" } },
  ]} />;
}
