import Link from "next/link";
import {
  MockupPage,
  StatCard,
  SectionCard,
  DataTable,
  Badge,
  LinkRow,
} from "@/components/mockup";
import {
  ClipboardList,
  Route,
  CheckCircle,
  AlertTriangle,
  Grid,
} from "@/components/icons";

export default function DashboardOverviewPage() {
  return (
    <MockupPage
      eyebrow="Main Dashboard · 전사 현황"
      title="전사 현황"
      icon={Grid}
      description="등록 스케줄(유효·만료)과 라우트 정보를 한눈에 확인합니다."
      actions={
        <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          현황 리포트 내보내기
        </button>
      }
    >
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="등록 스케줄 (유효)"
          value="1,284"
          unit="건"
          trend={{ dir: "up", value: "+6.2%" }}
        />
        <StatCard
          icon={AlertTriangle}
          label="만료 스케줄"
          value="312"
          unit="건"
          trend={{ dir: "down", value: "-3.1%" }}
        />
        <StatCard
          icon={Route}
          label="등록 라우트"
          value="486"
          unit="개"
          tone="navy"
        />
        <StatCard
          icon={CheckCircle}
          label="운영 선사"
          value="37"
          unit="사"
          tone="brand"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Registered routes */}
        <SectionCard
          title="등록 라우트 정보"
          icon={Route}
          action={
            <Link
              href="/master-data/routes"
              className="text-sm font-medium text-brand hover:underline"
            >
              전체 보기
            </Link>
          }
        >
          <DataTable
            columns={["라우트", "지역", "운송", "스케줄 수", "상태"]}
            rows={[
              [
                "KR PUSAN → JP TOKYO",
                "동북아",
                <Badge key="s" tone="info">해상</Badge>,
                "48",
                <Badge key="a" tone="success">운영중</Badge>,
              ],
              [
                "KR INCHEON → SG",
                "동남아",
                <Badge key="s" tone="info">해상</Badge>,
                "36",
                <Badge key="a" tone="success">운영중</Badge>,
              ],
              [
                "KR ICN → US LAX",
                "북미",
                <Badge key="a2" tone="warning">항공</Badge>,
                "21",
                <Badge key="a" tone="success">운영중</Badge>,
              ],
              [
                "KR PUSAN → CN SHA",
                "중화권",
                <Badge key="s" tone="info">해상</Badge>,
                "12",
                <Badge key="p" tone="muted">준비중</Badge>,
              ],
            ]}
          />
        </SectionCard>

        {/* Schedule validity summary */}
        <SectionCard title="스케줄 유효 현황" icon={ClipboardList}>
          <div className="space-y-4">
            <ValidityBar label="유효 스케줄" value={1284} total={1596} tone="success" />
            <ValidityBar label="만료 예정 (7일)" value={64} total={1596} tone="warning" />
            <ValidityBar label="만료 스케줄" value={312} total={1596} tone="danger" />
          </div>
          <div className="mt-6 rounded-xl bg-canvas p-4">
            <p className="eyebrow mb-1">유효율</p>
            <p className="data text-2xl font-bold text-ink">80.5%</p>
            <p className="mt-1 text-xs text-muted">
              전체 1,596건 중 1,284건 유효
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Quick links */}
      <SectionCard title="바로가기" icon={Grid}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <LinkRow title="운영 알림 확인" meta="만료 예정 / 오픈 예정 스케줄" tag="알림" />
          <LinkRow title="물류 뉴스" meta="국내·글로벌 Hot Trend" tag="뉴스" />
          <LinkRow title="스케줄 등록" meta="기준 정보 관리 · 스케줄" tag="등록" />
        </div>
      </SectionCard>
    </MockupPage>
  );
}

function ValidityBar({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: "success" | "warning" | "danger";
}) {
  const pct = Math.round((value / total) * 100);
  const barColor =
    tone === "success"
      ? "bg-emerald-500"
      : tone === "warning"
        ? "bg-amber-500"
        : "bg-brand";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="data font-semibold text-ink">{value.toLocaleString()}건</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-canvas">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
