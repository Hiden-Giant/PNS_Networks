import {
  MockupPage,
  SectionCard,
  DataTable,
  Badge,
  StatCard,
} from "@/components/mockup";
import { Bell, AlertTriangle, Clock, CheckCircle } from "@/components/icons";

export default function AlertsPage() {
  return (
    <MockupPage
      eyebrow="Main Dashboard · 운영 알림"
      title="운영 알림"
      icon={Bell}
      description="만료 예정 스케줄과 오픈 예정 스케줄을 모니터링합니다."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={AlertTriangle} label="만료 예정 (7일 내)" value="64" unit="건" tone="brand" />
        <StatCard icon={Clock} label="오픈 예정 스케줄" value="28" unit="건" tone="navy" />
        <StatCard icon={CheckCircle} label="금주 갱신 완료" value="142" unit="건" />
      </div>

      <SectionCard title="만료 예정 스케줄" icon={AlertTriangle}>
        <DataTable
          columns={["스케줄 ID", "라우트", "선사", "만료일", "잔여", "조치"]}
          rows={[
            [
              "SCH-24-0912",
              "KR PUSAN → JP TOKYO",
              "ZIM",
              "2024-05-12",
              <Badge key="d" tone="danger">D-2</Badge>,
              <button key="b" className="text-sm font-medium text-brand hover:underline">갱신</button>,
            ],
            [
              "SCH-24-0918",
              "KR INCHEON → SG",
              "KMTC",
              "2024-05-15",
              <Badge key="d" tone="warning">D-5</Badge>,
              <button key="b" className="text-sm font-medium text-brand hover:underline">갱신</button>,
            ],
            [
              "SCH-24-0931",
              "KR ICN → US LAX",
              "Korean Air",
              "2024-05-18",
              <Badge key="d" tone="warning">D-8</Badge>,
              <button key="b" className="text-sm font-medium text-brand hover:underline">갱신</button>,
            ],
          ]}
        />
      </SectionCard>

      <SectionCard title="오픈 예정 스케줄" icon={Clock}>
        <DataTable
          columns={["스케줄 ID", "라우트", "선사", "오픈일", "운송", "상태"]}
          rows={[
            [
              "SCH-24-1002",
              "KR PUSAN → VN HAIPHONG",
              "SITC",
              "2024-05-20",
              <Badge key="s" tone="info">해상</Badge>,
              <Badge key="st" tone="muted">예정</Badge>,
            ],
            [
              "SCH-24-1005",
              "KR ICN → DE FRA",
              "Lufthansa Cargo",
              "2024-05-22",
              <Badge key="a" tone="warning">항공</Badge>,
              <Badge key="st" tone="muted">예정</Badge>,
            ],
          ]}
        />
      </SectionCard>
    </MockupPage>
  );
}
