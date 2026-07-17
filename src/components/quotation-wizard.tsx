"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, MockupPage, SectionCard } from "./mockup";
import { CheckCircle, ChevronLeft, ChevronRight, Coin, FileText, MapPin, Plane, Ship, Users } from "./icons";

const STEPS = [
  { title: "기본정보", description: "고객과 견적 조건", icon: Users },
  { title: "운송·화물", description: "경로와 화물 조건", icon: MapPin },
  { title: "비용·마진", description: "원가와 판매가", icon: Coin },
  { title: "검토·저장", description: "최종 확인", icon: CheckCircle },
] as const;

type QuoteDraft = {
  customer: string; contact: string; currency: string; validUntil: string;
  mode: "SEA" | "AIR"; origin: string; destination: string; cargo: string; quantity: string;
  baseCost: string; surcharge: string; marginRate: string; note: string;
};

const INITIAL_DRAFT: QuoteDraft = {
  customer: "PNS Trading", contact: "이서연", currency: "KRW", validUntil: "2026-07-31",
  mode: "SEA", origin: "KR PUSAN", destination: "JP TOKYO", cargo: "General Cargo", quantity: "2.5 CBM",
  baseCost: "180000", surcharge: "25000", marginRate: "15", note: "운임 유효기간 및 현지 비용 별도 안내",
};

export function QuotationWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(INITIAL_DRAFT);
  const [saved, setSaved] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const baseCost = Number(draft.baseCost) || 0;
  const surcharge = Number(draft.surcharge) || 0;
  const margin = Math.round((baseCost + surcharge) * ((Number(draft.marginRate) || 0) / 100));
  const total = baseCost + surcharge + margin;
  const formatter = useMemo(() => new Intl.NumberFormat("ko-KR"), []);
  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  if (saved) {
    return <MockupPage eyebrow="견적 관리" title="견적 임시저장 완료" icon={CheckCircle} description="mock 상태에서 견적번호 Q-2026-0717-001이 생성되었습니다.">
      <section className="rounded-card border border-line bg-white p-10 text-center shadow-sm"><CheckCircle className="mx-auto h-14 w-14 text-emerald-500" /><h2 className="mt-5 text-xl font-bold text-ink">견적 초안이 준비되었습니다.</h2><p className="data mt-2 text-sm text-muted">Q-2026-0717-001 · {draft.customer}</p><div className="mt-6 flex justify-center gap-2"><Link href="/quotations" className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-soft">목록으로</Link><Link href="/quotations/Q-2026-0717-001" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">견적 상세 보기</Link></div></section>
    </MockupPage>;
  }

  return <MockupPage eyebrow="견적 관리 · 신규 작성" title="신규 견적 작성" icon={FileText} description="고객 조건부터 운임과 마진까지 단계별로 견적 초안을 작성합니다.">
    <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
      <ol className="h-fit rounded-card border border-line bg-white p-4 shadow-sm">{STEPS.map((item, index) => { const Icon = item.icon; const active = index === step; const complete = index < step; return <li key={item.title}><button type="button" onClick={() => setStep(index)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ${active ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-canvas"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${complete ? "bg-emerald-500 text-white" : active ? "bg-brand text-white" : "bg-canvas text-muted"}`}>{complete ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}</span><span><strong className="block text-sm">{index + 1}. {item.title}</strong><small className="text-xs opacity-70">{item.description}</small></span></button></li>; })}</ol>

      <SectionCard title={`${step + 1}. ${STEPS[step].title}`} icon={STEPS[step].icon}>
        {step === 0 && <div className="grid gap-5 sm:grid-cols-2"><Field label="고객사"><select value={draft.customer} onChange={(e) => update("customer", e.target.value)} className="form-control"><option>PNS Trading</option><option>Hanul Parts</option><option>Tokyo Bridge</option></select></Field><Field label="고객 담당자"><input value={draft.contact} onChange={(e) => update("contact", e.target.value)} className="form-control" /></Field><Field label="견적 통화"><select value={draft.currency} onChange={(e) => update("currency", e.target.value)} className="form-control"><option>KRW</option><option>USD</option><option>JPY</option></select></Field><Field label="견적 유효일"><input type="date" value={draft.validUntil} onChange={(e) => update("validUntil", e.target.value)} className="form-control" /></Field></div>}
        {step === 1 && <div className="space-y-6"><div className="grid grid-cols-2 gap-3">{(["SEA", "AIR"] as const).map((mode) => { const Icon = mode === "SEA" ? Ship : Plane; return <button key={mode} type="button" onClick={() => update("mode", mode)} className={`flex items-center justify-center gap-2 rounded-xl border p-5 font-semibold ${draft.mode === mode ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-soft"}`}><Icon className="h-6 w-6" />{mode === "SEA" ? "해상" : "항공"}</button>; })}</div><div className="grid gap-5 sm:grid-cols-2"><Field label="출발지"><input value={draft.origin} onChange={(e) => update("origin", e.target.value)} className="form-control" /></Field><Field label="도착지"><input value={draft.destination} onChange={(e) => update("destination", e.target.value)} className="form-control" /></Field><Field label="화물 품목"><input value={draft.cargo} onChange={(e) => update("cargo", e.target.value)} className="form-control" /></Field><Field label="중량·부피"><input value={draft.quantity} onChange={(e) => update("quantity", e.target.value)} className="form-control" /></Field></div></div>}
        {step === 2 && <div className="space-y-5"><div className="grid gap-5 sm:grid-cols-3"><Field label="기본 운임"><input type="number" value={draft.baseCost} onChange={(e) => update("baseCost", e.target.value)} className="form-control" /></Field><Field label="부대비용"><input type="number" value={draft.surcharge} onChange={(e) => update("surcharge", e.target.value)} className="form-control" /></Field><Field label="마진율 (%)"><input type="number" value={draft.marginRate} onChange={(e) => update("marginRate", e.target.value)} className="form-control" /></Field></div><div className="rounded-xl bg-navy p-5 text-white"><div className="grid gap-4 sm:grid-cols-3"><Amount label="원가 합계" value={baseCost + surcharge} /><Amount label="마진" value={margin} /><Amount label="예상 판매가" value={total} emphasis /></div></div><Field label="견적 비고"><textarea rows={4} value={draft.note} onChange={(e) => update("note", e.target.value)} className="form-control resize-none" /></Field></div>}
        {step === 3 && <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2"><Review label="고객" value={`${draft.customer} · ${draft.contact}`} /><Review label="유효일·통화" value={`${draft.validUntil} · ${draft.currency}`} /><Review label="운송 경로" value={`${draft.origin} → ${draft.destination}`} /><Review label="운송·화물" value={`${draft.mode} · ${draft.cargo} · ${draft.quantity}`} /></div><div className="rounded-xl border border-line p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm text-muted">최종 견적 금액</span><strong className="data text-xl text-brand sm:text-2xl">{draft.currency} {formatter.format(total)}</strong></div><p className="mt-3 border-t border-line pt-3 text-sm text-muted">{draft.note}</p></div><label className="flex items-start gap-3 rounded-xl bg-info-soft p-4 text-sm text-ink-soft"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]" />입력한 견적 조건과 금액을 확인했습니다.</label></div>}
        <div className="mt-8 flex justify-between border-t border-line pt-5"><button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="flex items-center gap-1 rounded-lg border border-line px-4 py-2 text-sm font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" />이전</button>{step < STEPS.length - 1 ? <button type="button" onClick={() => setStep((value) => value + 1)} className="flex items-center gap-1 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white">다음<ChevronRight className="h-4 w-4" /></button> : <button type="button" disabled={!confirmed} onClick={() => setSaved(true)} className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-faint">견적 임시저장</button>}</div>
      </SectionCard>

      <aside className="h-fit rounded-card bg-navy p-6 text-white shadow-sm xl:sticky xl:top-20"><p className="eyebrow !text-white/40">실시간 요약</p><h2 className="mt-1 text-lg font-bold">견적 초안</h2><dl className="mt-5 space-y-3 text-sm"><Summary label="고객사" value={draft.customer} /><Summary label="경로" value={`${draft.origin} → ${draft.destination}`} /><Summary label="운송" value={draft.mode} /><Summary label="화물" value={draft.quantity} /></dl><div className="mt-5 border-t border-white/10 pt-5"><p className="text-xs text-white/50">예상 판매가</p><p className="data mt-1 text-2xl font-bold">{draft.currency} {formatter.format(total)}</p><div className="mt-3"><Badge tone="warning">마진율 {draft.marginRate}%</Badge></div></div></aside>
    </div>
  </MockupPage>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-ink">{label}<div className="mt-2">{children}</div></label>; }
function Amount({ label, value, emphasis }: { label: string; value: number; emphasis?: boolean }) { return <div><p className="text-xs text-white/50">{label}</p><p className={`data mt-1 font-bold ${emphasis ? "text-xl text-white" : "text-lg text-white/80"}`}>KRW {value.toLocaleString("ko-KR")}</p></div>; }
function Review({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-canvas p-4"><p className="text-xs text-muted">{label}</p><p className="data mt-1 text-sm font-semibold text-ink">{value}</p></div>; }
function Summary({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3"><dt className="text-white/50">{label}</dt><dd className="data text-right font-semibold">{value}</dd></div>; }
