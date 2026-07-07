import {
  MockupPage,
  SectionCard,
  DataTable,
  Badge,
  StatCard,
} from "@/components/mockup";
import { SubTabs } from "@/components/sub-tabs";
import { Coin, Plus, Filter, TrendUp } from "@/components/icons";

const MASTER_TABS = [
  { href: "/master-data/routes", label: "라우트 관리" },
  { href: "/master-data/schedules", label: "스케줄 관리" },
  { href: "/master-data/rates", label: "운임 관리" },
];

export default function RatesPage() {
  return (
    <MockupPage
      eyebrow="기준 정보 관리 · 운임 관리"
      title="운임 관리"
      icon={Coin}
      description="라우트 + 시간/날짜 + 운임을 조합하여 요율을 등록·관리합니다."
      actions={
        <button className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="h-4 w-4" />
          운임 등록
        </button>
      }
    >
      <SubTabs tabs={MASTER_TABS} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Coin} label="등록 운임" value="2,140" unit="건" />
        <StatCard icon={TrendUp} label="평균 해상 운임" value="USD 1,024" tone="navy" />
        <StatCard icon={TrendUp} label="평균 항공 운임" value="USD 3,410" tone="brand" />
      </div>

      <SectionCard
        title="운임 테이블"
        icon={Coin}
        action={
          <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-canvas">
            <Filter className="h-4 w-4" />
            필터
          </button>
        }
      >
        <DataTable
          columns={["운임 코드", "라우트", "운송", "적용 단위", "요율", "유효기간", "상태"]}
          rows={[
            [
              "RATE-2405-001",
              "KR PUSAN → JP TOKYO",
              <Badge key="s" tone="info">해상</Badge>,
              "CBM",
              <span key="p" className="data font-semibold">USD 62 / CBM</span>,
              "~ 2024-06-30",
              <Badge key="a" tone="success">적용중</Badge>,
            ],
            [
              "RATE-2405-014",
              "KR INCHEON → SG",
              <Badge key="s" tone="info">해상</Badge>,
              "CBM",
              <span key="p" className="data font-semibold">USD 55 / CBM</span>,
              "~ 2024-06-30",
              <Badge key="a" tone="success">적용중</Badge>,
            ],
            [
              "RATE-2405-030",
              "KR ICN → US LAX",
              <Badge key="a2" tone="warning">항공</Badge>,
              "Kg",
              <span key="p" className="data font-semibold">USD 6.2 / Kg</span>,
              "~ 2024-05-31",
              <Badge key="w" tone="warning">만료예정</Badge>,
            ],
          ]}
        />
      </SectionCard>
    </MockupPage>
  );
}
