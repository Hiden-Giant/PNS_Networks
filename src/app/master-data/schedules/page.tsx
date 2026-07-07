import { MockupPage, SectionCard, DataTable, Badge } from "@/components/mockup";
import { SubTabs } from "@/components/sub-tabs";
import { ClipboardList, Plus, Filter } from "@/components/icons";

const MASTER_TABS = [
  { href: "/master-data/routes", label: "라우트 관리" },
  { href: "/master-data/schedules", label: "스케줄 관리" },
  { href: "/master-data/rates", label: "운임 관리" },
];

export default function SchedulesMgmtPage() {
  return (
    <MockupPage
      eyebrow="기준 정보 관리 · 스케줄 관리"
      title="스케줄 관리"
      icon={ClipboardList}
      description="라우트 + 시간/날짜 + 운임을 조합하여 스케줄을 등록합니다."
      actions={
        <button className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="h-4 w-4" />
          스케줄 등록
        </button>
      }
    >
      <SubTabs tabs={MASTER_TABS} />

      <SectionCard
        title="등록 스케줄 목록"
        icon={ClipboardList}
        action={
          <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-canvas">
            <Filter className="h-4 w-4" />
            필터
          </button>
        }
      >
        <DataTable
          columns={["스케줄 ID", "라우트", "선사", "출항", "도착", "운임", "상태"]}
          rows={[
            [
              "SCH-24-0912",
              "KR PUSAN → JP TOKYO",
              "ZIM",
              "2024-05-12",
              "2024-05-26",
              <span key="p" className="data font-semibold">USD 1,240</span>,
              <Badge key="a" tone="success">유효</Badge>,
            ],
            [
              "SCH-24-0918",
              "KR INCHEON → SG",
              "KMTC",
              "2024-05-15",
              "2024-05-29",
              <span key="p" className="data font-semibold">USD 980</span>,
              <Badge key="a" tone="success">유효</Badge>,
            ],
            [
              "SCH-24-0925",
              "KR BUSAN → VN HAIPHONG",
              "SITC",
              "2024-05-16",
              "2024-05-24",
              <span key="p" className="data font-semibold">USD 890</span>,
              <Badge key="a" tone="success">유효</Badge>,
            ],
            [
              "SCH-24-0931",
              "KR ICN → US LAX",
              "Korean Air",
              "2024-05-18",
              "2024-05-19",
              <span key="p" className="data font-semibold">USD 3,850</span>,
              <Badge key="w" tone="warning">만료예정</Badge>,
            ],
            [
              "SCH-24-0944",
              "KR BUSAN → NL ROTTERDAM",
              "HMM",
              "2024-05-20",
              "2024-06-22",
              <span key="p" className="data font-semibold">USD 3,420</span>,
              <Badge key="a" tone="success">유효</Badge>,
            ],
            [
              "SCH-24-0951",
              "KR ICN → HK",
              "Cathay Cargo",
              "2024-05-21",
              "2024-05-21",
              <span key="p" className="data font-semibold">USD 2,120</span>,
              <Badge key="a" tone="success">유효</Badge>,
            ],
            [
              "SCH-24-0958",
              "KR BUSAN → US LAX",
              "ONE",
              "2024-05-23",
              "2024-06-08",
              <span key="p" className="data font-semibold">USD 2,980</span>,
              <Badge key="a" tone="success">유효</Badge>,
            ],
            [
              "SCH-24-0962",
              "KR ICN → AE DUBAI",
              "Emirates",
              "2024-05-24",
              "2024-05-25",
              <span key="p" className="data font-semibold">USD 4,260</span>,
              <Badge key="w" tone="warning">만료예정</Badge>,
            ],
            [
              "SCH-24-0870",
              "KR PUSAN → CN SHA",
              "SITC",
              "2024-04-28",
              "2024-05-03",
              <span key="p" className="data font-semibold">USD 640</span>,
              <Badge key="d" tone="danger">만료</Badge>,
            ],
            [
              "SCH-24-0855",
              "KR INCHEON → JP OSAKA",
              "Namsung",
              "2024-04-25",
              "2024-05-01",
              <span key="p" className="data font-semibold">USD 720</span>,
              <Badge key="d" tone="danger">만료</Badge>,
            ],
          ]}
        />
      </SectionCard>
    </MockupPage>
  );
}
