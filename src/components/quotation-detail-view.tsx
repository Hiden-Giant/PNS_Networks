"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, DataTable, MockupPage, SectionCard, StatCard } from "./mockup";
import { Calendar, CheckCircle, Clock, Coin, FileText, History, Mail, MapPin, Users } from "./icons";

const TABS = ["견적 요약", "비용 내역", "버전", "승인·발송", "변경 이력"] as const;
type Tab = (typeof TABS)[number];

export function QuotationDetailView({ quotationId }: { quotationId: string }) {
  const [tab, setTab] = useState<Tab>("견적 요약");
  const [status, setStatus] = useState<"작성 중" | "승인 완료" | "발송 완료">("작성 중");
  const statusTone = status === "작성 중" ? "warning" : "success";

  return <MockupPage eyebrow={`견적 관리 · ${quotationId}`} title="견적 상세" icon={FileText} description="견적 조건, 금액, 버전, 승인과 고객 발송 이력을 확인합니다." actions={<div className="flex gap-2"><Link href="/quotations" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft">목록</Link><Link href="/quotations/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">새 버전 작성</Link></div>}>
    <section className="rounded-card border border-line bg-white p-6 shadow-sm"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-3"><h2 className="data text-xl font-bold text-ink">{quotationId}</h2><Badge tone={statusTone}>{status}</Badge></div><p className="mt-2 text-sm text-muted">PNS Trading · KR PUSAN → JP TOKYO · 해상</p></div><div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4"><Meta label="버전" value="v3" /><Meta label="통화" value="KRW" /><Meta label="유효일" value="2026-07-31" /><Meta label="담당자" value="김민준" /></div></div></section>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={Coin} label="최종 견적 금액" value="KRW 235,750" tone="navy" /><StatCard icon={Coin} label="예상 마진" value="KRW 30,750" /><StatCard icon={Calendar} label="견적 유효기간" value="14" unit="일" /><StatCard icon={Clock} label="최근 변경" value="오늘 10:24" tone="brand" /></div>

    <div className="overflow-x-auto rounded-xl border border-line bg-white p-1"><div className="flex min-w-max gap-1">{TABS.map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${tab === item ? "bg-brand text-white" : "text-ink-soft hover:bg-canvas"}`}>{item}</button>)}</div></div>

    {tab === "견적 요약" && <div className="grid gap-6 lg:grid-cols-2"><SectionCard title="고객·견적 조건" icon={Users}><DescriptionList items={[["고객사", "PNS Trading"], ["고객 담당자", "이서연"], ["견적 담당자", "김민준"], ["통화", "KRW"], ["유효일", "2026-07-31"], ["인코텀즈", "FOB"]]} /></SectionCard><SectionCard title="운송·화물 정보" icon={MapPin}><DescriptionList items={[["운송 방식", "해상 (LCL)"], ["출발지", "KR PUSAN"], ["도착지", "JP TOKYO"], ["화물", "General Cargo"], ["수량", "2.5 CBM"], ["예상 출항", "2026-07-22"]]} /></SectionCard></div>}

    {tab === "비용 내역" && <SectionCard title="운임·부대비용·마진" icon={Coin}><DataTable columns={["구분", "비용 코드", "설명", "원가", "마진", "판매가"]} rows={[["기본 운임", "OCEAN-LCL", "Busan → Tokyo", "KRW 180,000", "KRW 27,000", "KRW 207,000"], ["부대비용", "DOC", "Documentation Fee", "KRW 15,000", "KRW 2,250", "KRW 17,250"], ["부대비용", "WHF", "Warehouse Handling", "KRW 10,000", "KRW 1,500", "KRW 11,500"], [<strong key="t">합계</strong>, "-", "-", <strong key="c">KRW 205,000</strong>, <strong key="m">KRW 30,750</strong>, <strong key="s" className="text-brand">KRW 235,750</strong>]]} /></SectionCard>}

    {tab === "버전" && <SectionCard title="견적 버전" icon={History}><DataTable columns={["버전", "작성일", "작성자", "변경 사유", "금액", "상태"]} rows={[["v3", "2026-07-17 10:24", "김민준", "부대비용 조정", "KRW 235,750", <Badge key="v3" tone="success">현재 버전</Badge>], ["v2", "2026-07-16 16:40", "김민준", "마진율 조정", "KRW 231,000", <Badge key="v2" tone="muted">이전 버전</Badge>], ["v1", "2026-07-16 11:12", "김민준", "최초 작성", "KRW 228,000", <Badge key="v1" tone="muted">이전 버전</Badge>]]} /></SectionCard>}

    {tab === "승인·발송" && <div className="grid gap-6 lg:grid-cols-2"><SectionCard title="승인 처리" icon={CheckCircle}><p className="text-sm leading-6 text-muted">마진과 할인 조건을 확인한 뒤 견적을 승인합니다. 현재는 mock 상태만 변경됩니다.</p><button type="button" disabled={status !== "작성 중"} onClick={() => setStatus("승인 완료")} className="mt-5 w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white disabled:bg-faint">{status === "작성 중" ? "견적 승인" : "승인 완료"}</button></SectionCard><SectionCard title="고객 발송" icon={Mail}><p className="text-sm leading-6 text-muted">승인된 현재 버전을 고객 담당자 이메일로 발송합니다.</p><button type="button" disabled={status === "작성 중" || status === "발송 완료"} onClick={() => setStatus("발송 완료")} className="mt-5 w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white disabled:bg-faint">{status === "발송 완료" ? "발송 완료" : "견적서 발송"}</button></SectionCard></div>}

    {tab === "변경 이력" && <SectionCard title="변경·처리 이력" icon={History}><ol className="space-y-5">{[["오늘 10:24", "김민준", "v3 부대비용을 수정했습니다."], ["어제 16:40", "김민준", "마진율을 12%에서 15%로 변경했습니다."], ["어제 11:12", "김민준", "견적 초안을 생성했습니다."]].map(([time, user, text]) => <li key={time} className="flex gap-4"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" /><div><p className="text-sm font-semibold text-ink">{text}</p><p className="data mt-1 text-xs text-muted">{time} · {user}</p></div></li>)}</ol></SectionCard>}
  </MockupPage>;
}

function Meta({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-muted">{label}</p><p className="data mt-0.5 text-sm font-semibold text-ink">{value}</p></div>; }
function DescriptionList({ items }: { items: readonly (readonly [string, string])[] }) { return <dl className="divide-y divide-line">{items.map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0"><dt className="text-sm text-muted">{label}</dt><dd className="data text-right text-sm font-semibold text-ink">{value}</dd></div>)}</dl>; }
