"use client";

import { useState, type FormEvent } from "react";
import { Badge, MockupPage, StatCard } from "./mockup";
import { SlideOver } from "./slide-over";
import { CheckCircle, Clock, Plug, Settings, Sync } from "./icons";

type Provider = { id: string; name: string; category: string; endpoint: string; authType: string; schedule: string; active: boolean; lastRun: string; status: "정상" | "점검 필요" | "미연결" };
const INITIAL: Provider[] = [
  { id: "INT-SCHEDULE", name: "Carrier Schedule API", category: "스케줄", endpoint: "https://api.example.com/v1/schedules", authType: "API Key", schedule: "매일 02:00", active: true, lastRun: "오늘 02:04", status: "정상" },
  { id: "INT-RATE", name: "Freight Rate Feed", category: "운임", endpoint: "https://rates.example.com/feed", authType: "OAuth 2.0", schedule: "6시간마다", active: true, lastRun: "오늘 12:00", status: "점검 필요" },
  { id: "INT-NEWS", name: "Logistics News Feed", category: "뉴스", endpoint: "https://news.example.com/rss", authType: "없음", schedule: "매일 08:00", active: false, lastRun: "-", status: "미연결" },
];

export function IntegrationProviderManager() {
  const [providers, setProviders] = useState(INITIAL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Provider>(INITIAL[0]);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const editing = providers.find((item) => item.id === editingId);

  const openEditor = (provider: Provider) => { setDraft(provider); setEditingId(provider.id); setTestResult(null); };
  const save = (event: FormEvent) => { event.preventDefault(); setProviders((current) => current.map((item) => item.id === editingId ? draft : item)); setEditingId(null); };
  const testConnection = () => { setTesting(true); setTestResult(null); window.setTimeout(() => { setTesting(false); setTestResult("연결 테스트 성공 · 응답시간 184ms"); }, 700); };
  const toggle = (id: string) => setProviders((current) => current.map((item) => item.id === id ? { ...item, active: !item.active, status: !item.active ? "정상" : "미연결" } : item));

  return <><MockupPage eyebrow="연동 관리" title="연동 업체 설정" icon={Plug} description="외부 업체의 인증 방식, 수집 주기와 활성 상태를 관리합니다." actions={<button type="button" className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"><Plug className="h-4 w-4" />연동 업체 등록</button>}>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard icon={Plug} label="등록 연동" value={String(providers.length)} unit="개" /><StatCard icon={CheckCircle} label="정상 연동" value={String(providers.filter((item) => item.status === "정상").length)} unit="개" tone="navy" /><StatCard icon={Clock} label="점검 필요" value={String(providers.filter((item) => item.status !== "정상").length)} unit="개" tone="brand" /></div>
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">{providers.map((provider) => <article key={provider.id} className="rounded-card border border-line bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-info-soft text-info"><Plug className="h-6 w-6" /></span><Badge tone={provider.status === "정상" ? "success" : provider.status === "점검 필요" ? "warning" : "muted"}>{provider.status}</Badge></div><h2 className="mt-4 text-lg font-bold text-ink">{provider.name}</h2><p className="data mt-1 text-xs text-muted">{provider.id} · {provider.category}</p><dl className="mt-5 space-y-3 border-y border-line py-4"><ProviderMeta label="인증" value={provider.authType} /><ProviderMeta label="수집 주기" value={provider.schedule} /><ProviderMeta label="최근 실행" value={provider.lastRun} /></dl><div className="mt-4 flex items-center justify-between"><label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-soft"><input type="checkbox" checked={provider.active} onChange={() => toggle(provider.id)} className="h-4 w-4 accent-[var(--color-brand)]" />활성</label><button type="button" onClick={() => openEditor(provider)} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-canvas"><Settings className="h-4 w-4" />설정</button></div></article>)}</div>
  </MockupPage>
  <SlideOver open={Boolean(editing)} title="연동 업체 설정" description="인증정보는 화면에 원문으로 다시 표시하지 않습니다." onClose={() => setEditingId(null)} footer={<><button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">취소</button><button type="submit" form="provider-form" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">저장</button></>}>
    <form id="provider-form" onSubmit={save} className="space-y-5"><ProviderField label="연동명" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} /><ProviderField label="API Endpoint" value={draft.endpoint} onChange={(value) => setDraft((current) => ({ ...current, endpoint: value }))} /><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-ink">인증 방식<select value={draft.authType} onChange={(event) => setDraft((current) => ({ ...current, authType: event.target.value }))} className="form-control mt-2"><option>API Key</option><option>OAuth 2.0</option><option>Basic Auth</option><option>없음</option></select></label><ProviderField label="수집 주기" value={draft.schedule} onChange={(value) => setDraft((current) => ({ ...current, schedule: value }))} /></div>{draft.authType !== "없음" && <label className="block text-sm font-semibold text-ink">인증 비밀값<input type="password" placeholder="변경할 경우에만 입력" autoComplete="new-password" className="form-control mt-2" /><span className="mt-1.5 block text-xs font-normal text-muted">저장된 값: ••••••••••••</span></label>}<div className="rounded-xl border border-line bg-canvas p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-ink">연결 테스트</p><p className="mt-1 text-xs text-muted">현재 입력값으로 외부 API 연결을 확인합니다.</p></div><button type="button" disabled={testing} onClick={testConnection} className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><Sync className={`h-4 w-4 ${testing ? "animate-spin" : ""}`} />{testing ? "확인 중" : "테스트"}</button></div>{testResult && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600">{testResult}</p>}</div></form>
  </SlideOver></>;
}

function ProviderMeta({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 text-sm"><dt className="text-muted">{label}</dt><dd className="data text-right font-semibold text-ink">{value}</dd></div>; }
function ProviderField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-sm font-semibold text-ink">{label}<input required value={value} onChange={(event) => onChange(event.target.value)} className="form-control mt-2" /></label>; }
