import {
  MockupPage,
  SectionCard,
  DataTable,
  Badge,
  StatCard,
} from "@/components/mockup";
import { SubTabs } from "@/components/sub-tabs";
import { Globe, FileText, Users, Filter } from "@/components/icons";

const SETTINGS_TABS = [
  { href: "/settings/permissions", label: "권한 관리" },
  { href: "/settings/logs", label: "로그 관리" },
];

export default function LogsPage() {
  return (
    <MockupPage
      eyebrow="시스템 설정 · 로그 관리"
      title="로그 관리"
      icon={Globe}
      description="시스템 접속 및 주요 데이터 변경 이력을 보안 감사용으로 관리합니다."
      actions={
        <button className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-canvas">
          <Filter className="h-4 w-4" />
          기간 필터
        </button>
      }
    >
      <SubTabs tabs={SETTINGS_TABS} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="금일 접속" value="86" unit="회" />
        <StatCard icon={FileText} label="데이터 변경" value="214" unit="건" tone="navy" />
        <StatCard icon={Globe} label="보안 이벤트" value="3" unit="건" tone="brand" />
      </div>

      <SectionCard title="접속 로그" icon={Users}>
        <DataTable
          columns={["시각", "사용자", "IP", "동작", "결과"]}
          rows={[
            [
              "2024-05-10 09:20:11",
              "admin@pns.co.kr",
              "211.34.xx.12",
              "로그인",
              <Badge key="a" tone="success">성공</Badge>,
            ],
            [
              "2024-05-10 09:05:44",
              "store@pns.co.kr",
              "125.129.xx.88",
              "로그인",
              <Badge key="d" tone="danger">실패</Badge>,
            ],
            [
              "2024-05-10 08:41:02",
              "warehouse@pns.co.kr",
              "58.29.xx.9",
              "로그인",
              <Badge key="a" tone="success">성공</Badge>,
            ],
          ]}
        />
      </SectionCard>

      <SectionCard title="데이터 변경 이력" icon={FileText}>
        <DataTable
          columns={["시각", "사용자", "대상", "변경 내용", "구분"]}
          rows={[
            [
              "09:18:30",
              "admin@pns.co.kr",
              "RATE-2405-030",
              "항공 운임 6.0 → 6.2 USD/Kg",
              <Badge key="u" tone="warning">수정</Badge>,
            ],
            [
              "09:02:15",
              "admin@pns.co.kr",
              "SCH-24-1002",
              "신규 스케줄 등록",
              <Badge key="c" tone="success">생성</Badge>,
            ],
            [
              "08:47:59",
              "warehouse@pns.co.kr",
              "RT-KRCN-021",
              "라우트 비활성화",
              <Badge key="d" tone="danger">삭제</Badge>,
            ],
          ]}
        />
      </SectionCard>
    </MockupPage>
  );
}
