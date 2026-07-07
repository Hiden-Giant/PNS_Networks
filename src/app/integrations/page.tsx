import {
  MockupPage,
  SectionCard,
  DataTable,
  Badge,
  StatCard,
} from "@/components/mockup";
import {
  Plug,
  CheckCircle,
  AlertTriangle,
  Sync,
  Clock,
} from "@/components/icons";

export default function IntegrationsPage() {
  return (
    <MockupPage
      eyebrow="연동 관리 · API 연동 현황 모니터링"
      title="API 연동 현황 모니터링"
      icon={Plug}
      description="외부 시스템 API 연동 결과를 조회하고 상태를 모니터링합니다."
      actions={
        <button className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          <Sync className="h-4 w-4" />
          지금 동기화
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckCircle} label="정상 연동" value="12" unit="건" tone="navy" />
        <StatCard icon={AlertTriangle} label="오류 발생" value="2" unit="건" tone="brand" />
        <StatCard icon={Sync} label="금일 호출" value="48,210" unit="회" trend={{ dir: "up", value: "+8%" }} />
        <StatCard icon={Clock} label="평균 응답" value="182" unit="ms" trend={{ dir: "down", value: "-12ms" }} />
      </div>

      <SectionCard title="연동 시스템 현황" icon={Plug}>
        <DataTable
          columns={["연동 시스템", "구분", "최근 동기화", "성공률", "응답시간", "상태"]}
          rows={[
            [
              "선사 스케줄 API (ZIM)",
              "스케줄",
              "2024-05-10 09:12",
              "99.8%",
              "154ms",
              <Badge key="a" tone="success">정상</Badge>,
            ],
            [
              "관세청 통관 API",
              "통관",
              "2024-05-10 09:10",
              "99.2%",
              "210ms",
              <Badge key="a" tone="success">정상</Badge>,
            ],
            [
              "운임 지수 API (SCFI)",
              "운임",
              "2024-05-10 08:55",
              "94.1%",
              "402ms",
              <Badge key="w" tone="warning">지연</Badge>,
            ],
            [
              "창고관리(WMS) 연동",
              "재고",
              "2024-05-10 06:30",
              "87.5%",
              "—",
              <Badge key="d" tone="danger">오류</Badge>,
            ],
          ]}
        />
      </SectionCard>

      <SectionCard title="최근 연동 로그" icon={Clock}>
        <DataTable
          columns={["시각", "시스템", "요청", "결과", "코드"]}
          rows={[
            [
              "09:12:04",
              "ZIM 스케줄",
              "GET /schedules",
              <Badge key="a" tone="success">성공</Badge>,
              "200",
            ],
            [
              "09:10:47",
              "관세청 통관",
              "POST /clearance",
              <Badge key="a" tone="success">성공</Badge>,
              "200",
            ],
            [
              "08:55:22",
              "SCFI 운임",
              "GET /index",
              <Badge key="w" tone="warning">지연</Badge>,
              "200",
            ],
            [
              "06:30:11",
              "WMS 재고",
              "GET /stock",
              <Badge key="d" tone="danger">실패</Badge>,
              "504",
            ],
          ]}
        />
      </SectionCard>
    </MockupPage>
  );
}
