import Link from "next/link";
import {
  MockupPage,
  SectionCard,
  DataTable,
  Badge,
  StatCard,
} from "@/components/mockup";
import {
  FileText,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  Coin,
} from "@/components/icons";

export default function QuoteRequestsPage() {
  return (
    <MockupPage
      eyebrow="견적 관리 · 견적 요청 목록"
      title="견적 요청 목록"
      icon={FileText}
      description="접수된 견적 요청을 조회하고 상태를 관리합니다."
      actions={
        <Link
          href="/quotations"
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          신규 견적 작성
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="전체 견적 요청" value="342" unit="건" trend={{ dir: "up", value: "+12%" }} />
        <StatCard icon={Clock} label="검토 대기" value="28" unit="건" tone="brand" />
        <StatCard icon={CheckCircle} label="견적 완료" value="256" unit="건" tone="navy" />
        <StatCard icon={Coin} label="금월 성약 금액" value="KRW 84.2M" />
      </div>

      <SectionCard
        title="견적 요청 내역"
        icon={FileText}
        action={
          <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-canvas">
            <Filter className="h-4 w-4" />
            필터
          </button>
        }
      >
        <DataTable
          columns={["견적번호", "고객사", "라우트", "운송", "예상 금액", "접수일", "상태"]}
          rows={[
            [
              <span key="n" className="data font-medium">SCP-1254596</span>,
              "대한무역",
              "KR PUSAN → JP TOKYO",
              <Badge key="s" tone="info">해상</Badge>,
              <span key="p" className="data font-semibold">KRW 235,000</span>,
              "2024-05-10",
              <Badge key="w" tone="warning">검토 대기</Badge>,
            ],
            [
              <span key="n" className="data font-medium">SCP-1254588</span>,
              "글로벌셀러",
              "KR ICN → US LAX",
              <Badge key="a" tone="danger">항공</Badge>,
              <span key="p" className="data font-semibold">KRW 1,240,000</span>,
              "2024-05-09",
              <Badge key="c" tone="success">견적 완료</Badge>,
            ],
            [
              <span key="n" className="data font-medium">SCP-1254571</span>,
              "성진물산",
              "KR INCHEON → SG",
              <Badge key="s" tone="info">해상</Badge>,
              <span key="p" className="data font-semibold">KRW 412,000</span>,
              "2024-05-08",
              <Badge key="c" tone="success">견적 완료</Badge>,
            ],
            [
              <span key="n" className="data font-medium">SCP-1254560</span>,
              "동방로지스",
              "KR PUSAN → VN HAIPHONG",
              <Badge key="s" tone="info">해상</Badge>,
              <span key="p" className="data font-semibold">KRW 180,000</span>,
              "2024-05-07",
              <Badge key="m" tone="muted">보류</Badge>,
            ],
            [
              <span key="n" className="data font-medium">SCP-1254542</span>,
              "한빛교역",
              "KR PUSAN → CN SHANGHAI",
              <Badge key="s" tone="info">해상</Badge>,
              <span key="p" className="data font-semibold">KRW 96,000</span>,
              "2024-05-06",
              <Badge key="c" tone="success">견적 완료</Badge>,
            ],
          ]}
        />
      </SectionCard>
    </MockupPage>
  );
}
