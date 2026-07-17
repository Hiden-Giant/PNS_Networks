import Link from "next/link";
import { Badge, DataTable, MockupPage, SectionCard, StatCard } from "@/components/mockup";
import { CheckCircle, Clock, Coin, FileText, Plus } from "@/components/icons";

const QUOTATIONS = [
  { id: "Q-2026-0717-001", customer: "PNS Trading", route: "KR PUSAN → JP TOKYO", amount: "KRW 235,750", version: "v3", status: "작성 중", tone: "warning" as const },
  { id: "Q-2026-0716-014", customer: "Hanul Parts", route: "KR ICN → US LAX", amount: "USD 4,280", version: "v2", status: "승인 완료", tone: "success" as const },
  { id: "Q-2026-0715-008", customer: "Tokyo Bridge", route: "KR PUSAN → JP OSAKA", amount: "JPY 128,000", version: "v1", status: "발송 완료", tone: "info" as const },
];

export default function QuotationsPage() {
  return <MockupPage eyebrow="견적 관리" title="견적 목록" icon={FileText} description="작성 중인 견적과 승인·발송 상태를 조회합니다." actions={<Link href="/quotations/new" className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />신규 견적 작성</Link>}>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard icon={FileText} label="전체 견적" value="128" unit="건" /><StatCard icon={Clock} label="작성·승인 대기" value="18" unit="건" tone="brand" /><StatCard icon={Coin} label="금월 견적 금액" value="KRW 124.8M" tone="navy" /></div>
    <SectionCard title="최근 견적" icon={CheckCircle}><DataTable columns={["견적번호", "고객사", "라우트", "버전", "견적 금액", "상태", "관리"]} rows={QUOTATIONS.map((quote) => [<Link key="id" href={`/quotations/${quote.id}`} className="data font-semibold text-info hover:underline">{quote.id}</Link>, quote.customer, quote.route, quote.version, <strong key="amount" className="data">{quote.amount}</strong>, <Badge key="status" tone={quote.tone}>{quote.status}</Badge>, <Link key="detail" href={`/quotations/${quote.id}`} className="text-sm font-semibold text-info hover:underline">상세</Link>])} /></SectionCard>
  </MockupPage>;
}
