"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge, DataTable, MockupPage, SectionCard, StatCard } from "./mockup";
import { ConfirmDialog } from "./confirm-dialog";
import { SlideOver } from "./slide-over";
import { CheckCircle, Clock, Filter, MapPin, Plus, Search } from "./icons";
import { deactivateLocationAction, saveLocationAction, type LocationActionState } from "@/app/master-data/locations/actions";

const INITIAL_LOCATION_ACTION_STATE: LocationActionState = { success: false, message: "" };

type CountryOption = { id: string; iso2: string; nameKo: string; nameEn: string; region: { nameKo: string } };
type LocationRow = {
  id: string; code: string; type: "PORT" | "AIRPORT" | "CITY"; nameKo: string; nameEn: string;
  unLocode: string | null; iataCode: string | null; timezone: string; status: "ACTIVE" | "INACTIVE";
  country: { id: string; iso2: string; nameKo: string; region: { nameKo: string } };
};

export function LocationManagementPage({ locations, countries }: { locations: LocationRow[]; countries: CountryOption[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [editorId, setEditorId] = useState<string | "new" | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [pendingDeactivate, startDeactivate] = useTransition();
  const editing = editorId === "new" ? null : locations.find((item) => item.id === editorId) ?? null;
  const detail = locations.find((item) => item.id === detailId) ?? null;
  const deactivateTarget = locations.find((item) => item.id === deactivateId) ?? null;

  const filtered = useMemo(() => locations.filter((item) => {
    const text = [item.code, item.nameKo, item.nameEn, item.unLocode, item.iataCode, item.country.iso2, item.country.nameKo].join(" ").toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (typeFilter === "all" || item.type === typeFilter)
      && (statusFilter === "all" || item.status === statusFilter)
      && (countryFilter === "all" || item.country.id === countryFilter);
  }), [countryFilter, locations, query, statusFilter, typeFilter]);

  const handleSaved = (message: string) => { setEditorId(null); setNotice(message); router.refresh(); };
  const handleDeactivate = () => { if (!deactivateId) return; startDeactivate(async () => { const result = await deactivateLocationAction(deactivateId); setNotice(result.message); if (result.success) { setDetailId(null); router.refresh(); } setDeactivateId(null); }); };

  return <><MockupPage eyebrow="기준 정보 관리 · Neon 연결" title="지역·항구·공항 관리" icon={MapPin} description="Neon PostgreSQL에 저장된 국가, 항구와 공항 기준정보를 관리합니다." actions={<button type="button" onClick={() => setEditorId("new")} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Location 등록</button>}>
    {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-info/20 bg-info-soft px-4 py-3 text-sm font-semibold text-info"><span>{notice}</span><button type="button" aria-label="알림 닫기" onClick={() => setNotice("")} className="px-2">×</button></div>}
    <div className="grid gap-4 sm:grid-cols-3"><StatCard icon={MapPin} label="전체 Location" value={String(locations.length)} unit="개" /><StatCard icon={CheckCircle} label="활성" value={String(locations.filter((item) => item.status === "ACTIVE").length)} unit="개" tone="navy" /><StatCard icon={Clock} label="비활성" value={String(locations.filter((item) => item.status === "INACTIVE").length)} unit="개" tone="brand" /></div>
    <SectionCard title="Location 목록" icon={MapPin}><div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><label className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 lg:max-w-md"><Search className="h-4 w-4 text-faint" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Location 검색" placeholder="코드, 국가, 항구, 공항 검색" className="w-full bg-transparent text-sm outline-none" /></label><div className="flex flex-wrap gap-2"><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="유형 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 유형</option><option value="PORT">항구</option><option value="AIRPORT">공항</option></select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="상태 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 상태</option><option value="ACTIVE">활성</option><option value="INACTIVE">비활성</option></select><button type="button" aria-expanded={showFilters} onClick={() => setShowFilters((value) => !value)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${showFilters ? "border-brand bg-brand-soft text-brand" : "border-line"}`}><Filter className="h-4 w-4" />국가 필터</button></div></div>
      {showFilters && <div className="mb-5 rounded-xl bg-canvas p-4"><label className="text-sm font-semibold text-ink">국가<select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} className="form-control mt-2 max-w-sm"><option value="all">전체 국가</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.iso2} · {country.nameKo}</option>)}</select></label></div>}
      <DataTable columns={["내부 코드", "국가", "유형", "한글명", "영문명", "표준 코드", "시간대", "상태", "관리"]} rows={filtered.map((item) => [item.code, `${item.country.iso2} · ${item.country.nameKo}`, <Badge key="type" tone={item.type === "PORT" ? "info" : "warning"}>{item.type === "PORT" ? "항구" : "공항"}</Badge>, item.nameKo, item.nameEn, item.unLocode ?? item.iataCode ?? "-", item.timezone, <Badge key="status" tone={item.status === "ACTIVE" ? "success" : "muted"}>{item.status === "ACTIVE" ? "활성" : "비활성"}</Badge>, <button key="detail" type="button" onClick={() => setDetailId(item.id)} className="font-semibold text-info hover:underline">상세</button>])} />
      {filtered.length === 0 && <p className="border-t border-line py-12 text-center text-sm text-muted">조건에 맞는 Location이 없습니다.</p>}<p className="mt-4 border-t border-line pt-4 text-sm text-muted">전체 {locations.length}개 중 {filtered.length}개 표시 · Neon 실데이터</p>
    </SectionCard>
  </MockupPage>
  <SlideOver open={Boolean(detail)} title="Location 상세" description="Neon에 저장된 현재 기준정보입니다." onClose={() => setDetailId(null)} footer={detail && <><button type="button" disabled={detail.status === "INACTIVE"} onClick={() => setDeactivateId(detail.id)} className="mr-auto rounded-lg border border-brand/30 px-4 py-2 text-sm font-semibold text-brand disabled:opacity-40">비활성 처리</button><button type="button" onClick={() => { setEditorId(detail.id); setDetailId(null); }} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">수정</button></>}>
    {detail && <dl className="divide-y divide-line">{[["내부 코드", detail.code], ["국가", `${detail.country.iso2} · ${detail.country.nameKo}`], ["권역", detail.country.region.nameKo], ["유형", detail.type === "PORT" ? "항구" : "공항"], ["한글명", detail.nameKo], ["영문명", detail.nameEn], ["UN/LOCODE", detail.unLocode ?? "-"], ["IATA", detail.iataCode ?? "-"], ["시간대", detail.timezone], ["상태", detail.status]].map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr]"><dt className="text-sm font-semibold text-muted">{label}</dt><dd className="data text-sm text-ink">{value}</dd></div>)}</dl>}
  </SlideOver>
  <SlideOver open={Boolean(editorId)} title={editorId === "new" ? "Location 등록" : "Location 수정"} description="항구는 UN/LOCODE, 공항은 IATA 코드가 필수입니다." onClose={() => setEditorId(null)}><LocationEditorForm key={editorId ?? "closed"} location={editing} countries={countries} onSuccess={handleSaved} onCancel={() => setEditorId(null)} /></SlideOver>
  <ConfirmDialog open={Boolean(deactivateTarget)} title="Location을 비활성 처리할까요?" description={`${deactivateTarget?.nameKo ?? "선택한 Location"}은 기존 데이터에 유지되지만 신규 업무 선택 대상에서 제외됩니다.`} confirmLabel={pendingDeactivate ? "처리 중" : "비활성 처리"} onCancel={() => setDeactivateId(null)} onConfirm={handleDeactivate} /></>;
}

function LocationEditorForm({ location, countries, onSuccess, onCancel }: { location: LocationRow | null; countries: CountryOption[]; onSuccess: (message: string) => void; onCancel: () => void }) {
  const [state, action, pending] = useActionState(saveLocationAction, INITIAL_LOCATION_ACTION_STATE);
  const [type, setType] = useState(location?.type === "AIRPORT" ? "AIRPORT" : "PORT");
  useEffect(() => { if (state.success) onSuccess(state.message); }, [onSuccess, state]);
  return <form action={action} className="space-y-5">{location && <input type="hidden" name="id" value={location.id} />}<label className="block text-sm font-semibold">국가<select required name="countryId" defaultValue={location?.country.id ?? ""} className="form-control mt-2"><option value="" disabled>국가 선택</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.iso2} · {country.nameKo} ({country.region.nameKo})</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">유형<select name="type" value={type} onChange={(event) => setType(event.target.value as "PORT" | "AIRPORT")} className="form-control mt-2"><option value="PORT">항구</option><option value="AIRPORT">공항</option></select></label><FormField label="내부 코드" name="code" defaultValue={location?.code} placeholder={type === "PORT" ? "PORT-KRPUS" : "AIR-ICN"} /></div><div className="grid gap-4 sm:grid-cols-2"><FormField label="한글명" name="nameKo" defaultValue={location?.nameKo} /><FormField label="영문명" name="nameEn" defaultValue={location?.nameEn} /></div><div className="grid gap-4 sm:grid-cols-2"><FormField label="UN/LOCODE" name="unLocode" defaultValue={location?.unLocode ?? ""} placeholder="KRPUS" required={type === "PORT"} /><FormField label="IATA 코드" name="iataCode" defaultValue={location?.iataCode ?? ""} placeholder="ICN" required={type === "AIRPORT"} maxLength={3} /></div><FormField label="IANA 시간대" name="timezone" defaultValue={location?.timezone} placeholder="Asia/Seoul" />{state.message && !state.success && <p role="alert" className="rounded-lg bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">{state.message}</p>}<div className="flex justify-end gap-2 border-t border-line pt-5"><button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">취소</button><button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "저장 중" : "저장"}</button></div></form>;
}

function FormField({ label, name, defaultValue = "", placeholder, required = true, maxLength }: { label: string; name: string; defaultValue?: string; placeholder?: string; required?: boolean; maxLength?: number }) { return <label className="block text-sm font-semibold">{label}<input name={name} required={required} maxLength={maxLength} defaultValue={defaultValue} placeholder={placeholder} className="form-control mt-2" /></label>; }
