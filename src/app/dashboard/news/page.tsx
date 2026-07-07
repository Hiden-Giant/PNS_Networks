import { MockupPage, SectionCard, Badge } from "@/components/mockup";
import { Newspaper, Globe, TrendUp, ArrowUpRight } from "@/components/icons";

const KR_NEWS = [
  { title: "부산항 물동량 3개월 연속 증가…환적화물 강세", src: "물류신문", time: "2시간 전", tag: "HOT" },
  { title: "국내 항공화물 운임 상승세 전환, 반도체 수요 견인", src: "코리아쉬핑가제트", time: "5시간 전" },
  { title: "인천공항 스마트 통관 시스템 확대 적용", src: "물류매거진", time: "1일 전" },
  { title: "해운업계, 친환경 연료 전환 가속화", src: "쉬핑데일리", time: "1일 전" },
];

const GLOBAL_NEWS = [
  { title: "Red Sea disruption reshapes Asia-Europe schedules", src: "Loadstar", time: "3h ago", tag: "HOT" },
  { title: "Global air cargo demand up 11% YoY in April", src: "IATA", time: "6h ago" },
  { title: "Trans-Pacific spot rates ease as capacity returns", src: "Freightwaves", time: "1d ago" },
  { title: "Major carriers expand Southeast Asia coverage", src: "JOC", time: "2d ago" },
];

export default function NewsPage() {
  return (
    <MockupPage
      eyebrow="Main Dashboard · 물류 뉴스"
      title="물류 뉴스"
      icon={Newspaper}
      description="국내·글로벌 물류 관련 Hot Trend 뉴스를 제공합니다."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <SectionCard
          title="국내 물류 뉴스"
          icon={TrendUp}
          action={<Badge tone="danger">Hot Trend</Badge>}
        >
          <ul className="space-y-3">
            {KR_NEWS.map((n) => (
              <NewsItem key={n.title} {...n} />
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="글로벌 물류 뉴스"
          icon={Globe}
          action={<Badge tone="danger">Hot Trend</Badge>}
        >
          <ul className="space-y-3">
            {GLOBAL_NEWS.map((n) => (
              <NewsItem key={n.title} {...n} />
            ))}
          </ul>
        </SectionCard>
      </div>
    </MockupPage>
  );
}

function NewsItem({
  title,
  src,
  time,
  tag,
}: {
  title: string;
  src: string;
  time: string;
  tag?: string;
}) {
  return (
    <li>
      <a
        href="#"
        className="group flex items-start justify-between gap-3 rounded-xl border border-line px-4 py-3 transition-colors hover:border-brand/40 hover:bg-canvas/50"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {tag && <Badge tone="danger">{tag}</Badge>}
            <p className="truncate text-sm font-medium text-ink group-hover:text-brand">
              {title}
            </p>
          </div>
          <p className="mt-1 text-xs text-muted">
            {src} · {time}
          </p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-faint group-hover:text-brand" />
      </a>
    </li>
  );
}
