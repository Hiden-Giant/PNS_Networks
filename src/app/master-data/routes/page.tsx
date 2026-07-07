import { MockupPage, SectionCard, DataTable, Badge } from "@/components/mockup";
import { SubTabs } from "@/components/sub-tabs";
import { Route, Plus, Filter } from "@/components/icons";

const MASTER_TABS = [
  { href: "/master-data/routes", label: "라우트 관리" },
  { href: "/master-data/schedules", label: "스케줄 관리" },
  { href: "/master-data/rates", label: "운임 관리" },
];

export default function RoutesPage() {
  return (
    <MockupPage
      eyebrow="기준 정보 관리 · 라우트 관리"
      title="라우트 관리"
      icon={Route}
      description="지역·국가·항구 정보를 기반으로 기초 라우트 정보를 등록합니다."
      actions={
        <button className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="h-4 w-4" />
          라우트 등록
        </button>
      }
    >
      <SubTabs tabs={MASTER_TABS} />

      <SectionCard
        title="등록 라우트 목록"
        icon={Route}
        action={
          <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-canvas">
            <Filter className="h-4 w-4" />
            필터
          </button>
        }
      >
        <DataTable
          columns={["라우트 코드", "지역", "출발 항구", "도착 항구", "운송", "상태"]}
          rows={[
            [
              "RT-KRJP-001",
              "동북아",
              "KR PUSAN",
              "JP TOKYO",
              <Badge key="s" tone="info">해상</Badge>,
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "RT-KRSG-004",
              "동남아",
              "KR INCHEON",
              "SG SINGAPORE",
              <Badge key="s" tone="info">해상</Badge>,
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "RT-KRUS-011",
              "북미",
              "KR ICN",
              "US LAX",
              <Badge key="a2" tone="warning">항공</Badge>,
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "RT-KRCN-021",
              "중화권",
              "KR PUSAN",
              "CN SHANGHAI",
              <Badge key="s" tone="info">해상</Badge>,
              <Badge key="p" tone="muted">비활성</Badge>,
            ],
            [
              "RT-KRVN-025",
              "동남아",
              "KR PUSAN",
              "VN HAIPHONG",
              <Badge key="s" tone="info">해상</Badge>,
              <Badge key="a" tone="success">활성</Badge>,
            ],
          ]}
        />
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat label="등록 지역" value="6" unit="개" />
        <MiniStat label="등록 국가" value="24" unit="개국" />
        <MiniStat label="등록 항구" value="118" unit="개소" />
      </div>
    </MockupPage>
  );
}

function MiniStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-sm">
      <p className="eyebrow mb-2">{label}</p>
      <p className="data text-2xl font-bold text-ink">
        {value}
        <span className="ml-1 text-sm font-normal text-muted">{unit}</span>
      </p>
    </div>
  );
}
