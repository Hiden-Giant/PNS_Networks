"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deactivateCarrierAction, saveCarrierAction, type CarrierActionState } from "@/app/master-data/carriers/actions";
import { ConfirmDialog } from "./confirm-dialog";
import { CheckCircle, Clock, Filter, Plus, Search, Ship } from "./icons";
import { Badge, DataTable, MockupPage, SectionCard, StatCard } from "./mockup";
import { SlideOver } from "./slide-over";

const INITIAL_STATE: CarrierActionState = { success: false, message: "" };
const TYPE_LABEL = { OCEAN: "선사", AIRLINE: "항공사", TRUCKING: "트럭 운송사", RAIL: "철도 운송사" } as const;

type CarrierRow = {
  id: string;
  code: string;
  type: keyof typeof TYPE_LABEL;
  nameKo: string;
  nameEn: string;
  scac: string | null;
  iataCode: string | null;
  status: "ACTIVE" | "INACTIVE";
  _count: { schedules: number; rates: number };
};

export function CarrierManagementPage({ carriers }: { carriers: CarrierRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorId, setEditorId] = useState<string | "new" | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [pendingDeactivate, startDeactivate] = useTransition();
  const editing = editorId === "new" ? null : carriers.find((item) => item.id === editorId) ?? null;
  const detail = carriers.find((item) => item.id === detailId) ?? null;
  const deactivateTarget = carriers.find((item) => item.id === deactivateId) ?? null;

  const filtered = useMemo(() => carriers.filter((item) => {
    const text = [item.code, item.nameKo, item.nameEn, item.scac, item.iataCode].join(" ").toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (typeFilter === "all" || item.type === typeFilter)
      && (statusFilter === "all" || item.status === statusFilter);
  }), [carriers, query, statusFilter, typeFilter]);

  const handleSaved = (message: string) => { setEditorId(null); setNotice(message); router.refresh(); };
  const handleDeactivate = () => {
    if (!deactivateId) return;
    startDeactivate(async () => {
      const result = await deactivateCarrierAction(deactivateId);
      setNotice(result.message);
      if (result.success) { setDetailId(null); router.refresh(); }
      setDeactivateId(null);
    });
  };

  return <>
    <MockupPage eyebrow="기준 정보 관리 · Neon 연결" title="선사·항공사 관리" icon={Ship} description="운임과 스케줄에 사용하는 선사·항공사 기준정보를 관리합니다." actions={<button type="button" onClick={() => setEditorId("new")} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />운송사 등록</button>}>
      {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-info/20 bg-info-soft px-4 py-3 text-sm font-semibold text-info"><span>{notice}</span><button type="button" aria-label="알림 닫기" onClick={() => setNotice("")} className="px-2">×</button></div>}
      <div className="grid gap-4 sm:grid-cols-3"><StatCard icon={Ship} label="전체 운송사" value={String(carriers.length)} unit="개" /><StatCard icon={CheckCircle} label="활성" value={String(carriers.filter((item) => item.status === "ACTIVE").length)} unit="개" tone="navy" /><StatCard icon={Clock} label="비활성" value={String(carriers.filter((item) => item.status === "INACTIVE").length)} unit="개" tone="brand" /></div>
      <SectionCard title="운송사 목록" icon={Ship}>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 lg:max-w-md"><Search className="h-4 w-4 text-faint" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="운송사 검색" placeholder="운송사명, 내부 코드, SCAC, IATA 검색" className="w-full bg-transparent text-sm outline-none" /></label>
          <div className="flex flex-wrap gap-2"><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="유형 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 유형</option>{Object.entries(TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="상태 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 상태</option><option value="ACTIVE">활성</option><option value="INACTIVE">비활성</option></select><span className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-muted"><Filter className="h-4 w-4" />{filtered.length}건</span></div>
        </div>
        <DataTable columns={["내부 코드", "운송사명", "유형", "SCAC/IATA", "스케줄", "운임", "상태", "관리"]} rows={filtered.map((item) => [item.code, item.nameKo, <Badge key="type" tone={item.type === "OCEAN" ? "info" : item.type === "AIRLINE" ? "warning" : "muted"}>{TYPE_LABEL[item.type]}</Badge>, item.scac ?? item.iataCode ?? "-", String(item._count.schedules), String(item._count.rates), <Badge key="status" tone={item.status === "ACTIVE" ? "success" : "muted"}>{item.status === "ACTIVE" ? "활성" : "비활성"}</Badge>, <button key="detail" type="button" onClick={() => setDetailId(item.id)} className="font-semibold text-info hover:underline">상세</button>])} />
        {filtered.length === 0 && <p className="border-t border-line py-12 text-center text-sm text-muted">조건에 맞는 운송사가 없습니다.</p>}
        <p className="mt-4 border-t border-line pt-4 text-sm text-muted">전체 {carriers.length}개 중 {filtered.length}개 표시 · Neon 실데이터</p>
      </SectionCard>
    </MockupPage>
    <SlideOver open={Boolean(detail)} title="운송사 상세" description="Neon에 저장된 운송사 기준정보입니다." onClose={() => setDetailId(null)} footer={detail && <><button type="button" disabled={detail.status === "INACTIVE" || pendingDeactivate} onClick={() => setDeactivateId(detail.id)} className="mr-auto rounded-lg border border-brand/30 px-4 py-2 text-sm font-semibold text-brand disabled:opacity-40">비활성화</button><button type="button" onClick={() => { setEditorId(detail.id); setDetailId(null); }} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">수정</button></>}>
      {detail && <dl className="divide-y divide-line">{[["내부 코드", detail.code], ["유형", TYPE_LABEL[detail.type]], ["한글명", detail.nameKo], ["영문명", detail.nameEn], ["SCAC", detail.scac ?? "-"], ["IATA 항공사 코드", detail.iataCode ?? "-"], ["연결 스케줄", `${detail._count.schedules}건`], ["연결 운임", `${detail._count.rates}건`], ["상태", detail.status === "ACTIVE" ? "활성" : "비활성"]].map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-[150px_1fr]"><dt className="text-sm font-semibold text-muted">{label}</dt><dd className="data text-sm text-ink">{value}</dd></div>)}</dl>}
    </SlideOver>
    <SlideOver open={Boolean(editorId)} title={editorId === "new" ? "운송사 등록" : "운송사 수정"} description="선사는 SCAC, 항공사는 IATA 항공사 코드를 입력합니다." onClose={() => setEditorId(null)}><CarrierEditorForm key={editorId ?? "closed"} carrier={editing} onSuccess={handleSaved} onCancel={() => setEditorId(null)} /></SlideOver>
    <ConfirmDialog open={Boolean(deactivateTarget)} title="운송사를 비활성화할까요?" description={`${deactivateTarget?.nameKo ?? "선택한 운송사"}는 기존 운임·스케줄에서 유지되지만 신규 업무 선택 대상에서는 제외됩니다.`} confirmLabel={pendingDeactivate ? "처리 중" : "비활성화"} onCancel={() => setDeactivateId(null)} onConfirm={handleDeactivate} />
  </>;
}

function CarrierEditorForm({ carrier, onSuccess, onCancel }: { carrier: CarrierRow | null; onSuccess: (message: string) => void; onCancel: () => void }) {
  const [state, action, pending] = useActionState(saveCarrierAction, INITIAL_STATE);
  const [type, setType] = useState<CarrierRow["type"]>(carrier?.type ?? "OCEAN");
  useEffect(() => { if (state.success) onSuccess(state.message); }, [onSuccess, state]);
  return <form action={action} className="space-y-5">
    {carrier && <input type="hidden" name="id" value={carrier.id} />}
    <div className="grid gap-4 sm:grid-cols-2"><FormField label="내부 코드" name="code" defaultValue={carrier?.code} placeholder="OCEAN-MAERSK" /><label className="block text-sm font-semibold">유형<select name="type" value={type} onChange={(event) => setType(event.target.value as CarrierRow["type"])} className="form-control mt-2">{Object.entries(TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><FormField label="한글명" name="nameKo" defaultValue={carrier?.nameKo} /><FormField label="영문명" name="nameEn" defaultValue={carrier?.nameEn} /></div>
    <div className="grid gap-4 sm:grid-cols-2"><FormField label="SCAC" name="scac" defaultValue={carrier?.scac ?? ""} placeholder="MAEU" required={type === "OCEAN"} maxLength={4} /><FormField label="IATA 항공사 코드" name="iataCode" defaultValue={carrier?.iataCode ?? ""} placeholder="KE" required={type === "AIRLINE"} maxLength={2} /></div>
    {state.message && !state.success && <p role="alert" className="rounded-lg bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">{state.message}</p>}
    <div className="flex justify-end gap-2 border-t border-line pt-5"><button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">취소</button><button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "저장 중" : "저장"}</button></div>
  </form>;
}

function FormField({ label, name, defaultValue = "", placeholder, required = true, maxLength }: { label: string; name: string; defaultValue?: string; placeholder?: string; required?: boolean; maxLength?: number }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} required={required} maxLength={maxLength} defaultValue={defaultValue} placeholder={placeholder} className="form-control mt-2" /></label>;
}
