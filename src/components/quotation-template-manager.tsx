"use client";

import { useState, type FormEvent } from "react";
import { Badge, MockupPage, StatCard } from "./mockup";
import { ConfirmDialog } from "./confirm-dialog";
import { SlideOver } from "./slide-over";
import { CheckCircle, FileText, Plus, Users } from "./icons";

type Template = { id: string; name: string; mode: string; language: string; customer: string; terms: string; active: boolean };
const INITIAL: Template[] = [
  { id: "TPL-SEA-KR", name: "해상 수출 기본 견적서", mode: "해상", language: "한국어", customer: "공통", terms: "운임 유효기간 내 선적 조건이며 현지 발생 비용은 별도입니다.", active: true },
  { id: "TPL-AIR-EN", name: "Air Export Quotation", mode: "항공", language: "English", customer: "공통", terms: "Rates are subject to space availability and fuel surcharge changes.", active: true },
  { id: "TPL-PNS-JP", name: "PNS Trading 일본향", mode: "해상", language: "한국어", customer: "PNS Trading", terms: "부산 출항 일본향 LCL 기준이며 통관비는 별도입니다.", active: false },
];

export function QuotationTemplateManager() {
  const [templates, setTemplates] = useState(INITIAL);
  const [selectedId, setSelectedId] = useState(INITIAL[0].id);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Template, "active">>(INITIAL[0]);
  const selected = templates.find((item) => item.id === selectedId) ?? templates[0];

  const openCreate = () => { setDraft({ id: "", name: "", mode: "해상", language: "한국어", customer: "공통", terms: "" }); setEditingId("new"); };
  const openEdit = (item: Template) => { setDraft(item); setEditingId(item.id); };
  const save = (event: FormEvent) => { event.preventDefault(); if (editingId === "new") { const created = { ...draft, id: draft.id || `TPL-${Date.now()}`, active: true }; setTemplates((current) => [...current, created]); setSelectedId(created.id); } else { setTemplates((current) => current.map((item) => item.id === editingId ? { ...item, ...draft } : item)); } setEditingId(null); };
  const duplicate = (item: Template) => { const copy = { ...item, id: `${item.id}-COPY`, name: `${item.name} 복사본`, active: false }; setTemplates((current) => [...current, copy]); setSelectedId(copy.id); };
  const deactivate = () => { if (!deactivateId) return; setTemplates((current) => current.map((item) => item.id === deactivateId ? { ...item, active: false } : item)); setDeactivateId(null); };

  return <><MockupPage eyebrow="견적 관리" title="견적 템플릿" icon={FileText} description="운송 유형과 고객 조건에 맞는 견적서 기본 문구와 출력 형식을 관리합니다." actions={<button type="button" onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />템플릿 등록</button>}>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard icon={FileText} label="전체 템플릿" value={String(templates.length)} unit="개" /><StatCard icon={CheckCircle} label="활성 템플릿" value={String(templates.filter((item) => item.active).length)} unit="개" tone="navy" /><StatCard icon={Users} label="고객 전용" value={String(templates.filter((item) => item.customer !== "공통").length)} unit="개" tone="brand" /></div>
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]"><section className="rounded-card border border-line bg-white p-4 shadow-sm"><div className="space-y-2">{templates.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`w-full rounded-xl border p-4 text-left transition-colors ${selected?.id === item.id ? "border-brand bg-brand-soft" : "border-line hover:bg-canvas"}`}><div className="flex items-start justify-between gap-2"><strong className="text-sm text-ink">{item.name}</strong><Badge tone={item.active ? "success" : "muted"}>{item.active ? "활성" : "비활성"}</Badge></div><p className="data mt-2 text-xs text-muted">{item.id} · {item.mode} · {item.language}</p></button>)}</div></section>
      {selected && <section className="rounded-card border border-line bg-white shadow-sm"><header className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow">Template Preview</p><h2 className="mt-1 text-lg font-bold text-ink">{selected.name}</h2></div><div className="flex gap-2"><button type="button" onClick={() => duplicate(selected)} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-soft">복제</button><button type="button" onClick={() => openEdit(selected)} className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white">편집</button></div></header><div className="p-6"><div className="mx-auto max-w-2xl border border-line bg-white p-8 shadow-sm"><div className="flex justify-between border-b-2 border-navy pb-5"><div><p className="text-xl font-black text-navy">PNS Networks</p><p className="mt-1 text-xs text-muted">Freight Forwarding Quotation</p></div><p className="data text-sm font-bold text-brand">QUOTATION</p></div><dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><Preview label="고객 적용" value={selected.customer} /><Preview label="운송 유형" value={selected.mode} /><Preview label="언어" value={selected.language} /><Preview label="템플릿 코드" value={selected.id} /></dl><div className="mt-8 min-h-32 rounded-lg bg-canvas p-4"><p className="eyebrow">Terms & Conditions</p><p className="mt-3 text-sm leading-6 text-ink-soft">{selected.terms}</p></div></div><button type="button" disabled={!selected.active} onClick={() => setDeactivateId(selected.id)} className="mt-5 text-sm font-semibold text-brand disabled:text-faint">템플릿 비활성 처리</button></div></section>}
    </div>
  </MockupPage>
  <SlideOver open={Boolean(editingId)} title={editingId === "new" ? "템플릿 등록" : "템플릿 편집"} description="견적서에 적용할 기본 조건과 문구를 설정합니다." onClose={() => setEditingId(null)} footer={<><button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">취소</button><button type="submit" form="template-form" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">저장</button></>}><form id="template-form" onSubmit={save} className="space-y-5"><TemplateField label="템플릿 코드" value={draft.id} onChange={(value) => setDraft((current) => ({ ...current, id: value }))} disabled={editingId !== "new"} /><TemplateField label="템플릿명" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} /><div className="grid grid-cols-2 gap-4"><TemplateField label="운송 유형" value={draft.mode} onChange={(value) => setDraft((current) => ({ ...current, mode: value }))} /><TemplateField label="언어" value={draft.language} onChange={(value) => setDraft((current) => ({ ...current, language: value }))} /></div><TemplateField label="적용 고객" value={draft.customer} onChange={(value) => setDraft((current) => ({ ...current, customer: value }))} /><label className="block text-sm font-semibold text-ink">약관·기본 문구<textarea required rows={7} value={draft.terms} onChange={(event) => setDraft((current) => ({ ...current, terms: event.target.value }))} className="form-control mt-2 resize-none" /></label></form></SlideOver>
  <ConfirmDialog open={Boolean(deactivateId)} title="템플릿을 비활성 처리할까요?" description="기존 견적에는 영향을 주지 않으며 신규 견적에서 선택할 수 없게 됩니다." confirmLabel="비활성 처리" onCancel={() => setDeactivateId(null)} onConfirm={deactivate} /></>;
}

function Preview({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-muted">{label}</dt><dd className="data mt-1 font-semibold text-ink">{value}</dd></div>; }
function TemplateField({ label, value, onChange, disabled }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean }) { return <label className="block text-sm font-semibold text-ink">{label}<input required disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="form-control mt-2 disabled:bg-canvas disabled:text-muted" /></label>; }
