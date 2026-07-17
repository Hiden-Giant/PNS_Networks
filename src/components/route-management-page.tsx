"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deactivateRouteAction, saveRouteAction, type RouteActionState } from "@/app/master-data/routes/actions";
import { ConfirmDialog } from "./confirm-dialog";
import { CheckCircle, Clock, Filter, Plus, Route, Search } from "./icons";
import { Badge, DataTable, MockupPage, SectionCard, StatCard } from "./mockup";
import { SlideOver } from "./slide-over";
import { SubTabs } from "./sub-tabs";

const INITIAL_STATE: RouteActionState = { success: false, message: "" };
const MODE_LABEL = { SEA: "해상", AIR: "항공", ROAD: "도로", RAIL: "철도" } as const;
const MASTER_TABS = [
  { href: "/master-data/routes", label: "라우트 관리" },
  { href: "/master-data/schedules", label: "스케줄 관리" },
  { href: "/master-data/rates", label: "운임 관리" },
];

type Mode = keyof typeof MODE_LABEL;
type LocationOption = {
  id: string; code: string; type: "PORT" | "AIRPORT" | "CITY"; nameKo: string; nameEn: string;
  unLocode: string | null; iataCode: string | null; country: { iso2: string; nameKo: string };
};
type RouteLocation = Pick<LocationOption, "id" | "code" | "type" | "nameKo" | "unLocode" | "iataCode"> & { country: { iso2: string } };
type RouteRow = {
  id: string; code: string; transportMode: Mode; transshipmentAllowed: boolean; status: "ACTIVE" | "INACTIVE";
  origin: RouteLocation; destination: RouteLocation;
  _count: { schedules: number; rates: number; quoteRequests: number };
};

function locationLabel(location: RouteLocation | LocationOption) {
  return `${location.country.iso2} · ${location.unLocode ?? location.iataCode ?? location.code} · ${location.nameKo}`;
}

export function RouteManagementPage({ routes, locations }: { routes: RouteRow[]; locations: LocationOption[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorId, setEditorId] = useState<string | "new" | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [pendingDeactivate, startDeactivate] = useTransition();
  const editing = editorId === "new" ? null : routes.find((item) => item.id === editorId) ?? null;
  const detail = routes.find((item) => item.id === detailId) ?? null;
  const deactivateTarget = routes.find((item) => item.id === deactivateId) ?? null;

  const filtered = useMemo(() => routes.filter((item) => {
    const text = [item.code, locationLabel(item.origin), locationLabel(item.destination), MODE_LABEL[item.transportMode]].join(" ").toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (modeFilter === "all" || item.transportMode === modeFilter)
      && (statusFilter === "all" || item.status === statusFilter);
  }), [modeFilter, query, routes, statusFilter]);

  const handleSaved = (message: string) => { setEditorId(null); setNotice(message); router.refresh(); };
  const handleDeactivate = () => {
    if (!deactivateId) return;
    startDeactivate(async () => {
      const result = await deactivateRouteAction(deactivateId);
      setNotice(result.message);
      if (result.success) { setDetailId(null); router.refresh(); }
      setDeactivateId(null);
    });
  };

  return <>
    <MockupPage eyebrow="기준 정보 관리 · Neon 연결" title="라우트 관리" icon={Route} description="출발지와 도착지를 운송 모드별로 연결해 스케줄과 운임의 기준 라우트를 관리합니다." actions={<button type="button" onClick={() => setEditorId("new")} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />라우트 등록</button>}>
      <SubTabs tabs={MASTER_TABS} />
      {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-info/20 bg-info-soft px-4 py-3 text-sm font-semibold text-info"><span>{notice}</span><button type="button" aria-label="알림 닫기" onClick={() => setNotice("")} className="px-2">×</button></div>}
      <div className="grid gap-4 sm:grid-cols-3"><StatCard icon={Route} label="전체 라우트" value={String(routes.length)} unit="개" /><StatCard icon={CheckCircle} label="활성" value={String(routes.filter((item) => item.status === "ACTIVE").length)} unit="개" tone="navy" /><StatCard icon={Clock} label="비활성" value={String(routes.filter((item) => item.status === "INACTIVE").length)} unit="개" tone="brand" /></div>
      <SectionCard title="등록 라우트 목록" icon={Route}>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><label className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 lg:max-w-md"><Search className="h-4 w-4 text-faint" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="라우트 검색" placeholder="라우트 코드, 출발지, 도착지 검색" className="w-full bg-transparent text-sm outline-none" /></label><div className="flex flex-wrap gap-2"><select value={modeFilter} onChange={(event) => setModeFilter(event.target.value)} aria-label="운송 모드 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 운송 모드</option>{Object.entries(MODE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="상태 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 상태</option><option value="ACTIVE">활성</option><option value="INACTIVE">비활성</option></select><span className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-muted"><Filter className="h-4 w-4" />{filtered.length}건</span></div></div>
        <DataTable columns={["라우트 코드", "출발지", "도착지", "운송", "환적", "스케줄", "운임", "상태", "관리"]} rows={filtered.map((item) => [item.code, locationLabel(item.origin), locationLabel(item.destination), <Badge key="mode" tone={item.transportMode === "SEA" ? "info" : item.transportMode === "AIR" ? "warning" : "muted"}>{MODE_LABEL[item.transportMode]}</Badge>, item.transshipmentAllowed ? "허용" : "직항", `${item._count.schedules}건`, `${item._count.rates}건`, <Badge key="status" tone={item.status === "ACTIVE" ? "success" : "muted"}>{item.status === "ACTIVE" ? "활성" : "비활성"}</Badge>, <button key="detail" type="button" onClick={() => setDetailId(item.id)} className="font-semibold text-info hover:underline">상세</button>])} />
        {filtered.length === 0 && <p className="border-t border-line py-12 text-center text-sm text-muted">조건에 맞는 라우트가 없습니다.</p>}<p className="mt-4 border-t border-line pt-4 text-sm text-muted">전체 {routes.length}개 중 {filtered.length}개 표시 · Neon 실데이터</p>
      </SectionCard>
    </MockupPage>
    <SlideOver open={Boolean(detail)} title="라우트 상세" description="Neon에 저장된 운송 구간 기준정보입니다." onClose={() => setDetailId(null)} footer={detail && <><button type="button" disabled={detail.status === "INACTIVE" || pendingDeactivate} onClick={() => setDeactivateId(detail.id)} className="mr-auto rounded-lg border border-brand/30 px-4 py-2 text-sm font-semibold text-brand disabled:opacity-40">비활성화</button><button type="button" onClick={() => { setEditorId(detail.id); setDetailId(null); }} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">수정</button></>}>
      {detail && <dl className="divide-y divide-line">{[["라우트 코드", detail.code], ["출발지", locationLabel(detail.origin)], ["도착지", locationLabel(detail.destination)], ["운송 모드", MODE_LABEL[detail.transportMode]], ["환적", detail.transshipmentAllowed ? "허용" : "직항"], ["연결 스케줄", `${detail._count.schedules}건`], ["연결 운임", `${detail._count.rates}건`], ["견적 요청", `${detail._count.quoteRequests}건`], ["상태", detail.status === "ACTIVE" ? "활성" : "비활성"]].map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-[150px_1fr]"><dt className="text-sm font-semibold text-muted">{label}</dt><dd className="data text-sm text-ink">{value}</dd></div>)}</dl>}
    </SlideOver>
    <SlideOver open={Boolean(editorId)} title={editorId === "new" ? "라우트 등록" : "라우트 수정"} description="해상은 항구, 항공은 공항 위치만 선택할 수 있습니다." onClose={() => setEditorId(null)}><RouteEditorForm key={editorId ?? "closed"} route={editing} locations={locations} onSuccess={handleSaved} onCancel={() => setEditorId(null)} /></SlideOver>
    <ConfirmDialog open={Boolean(deactivateTarget)} title="라우트를 비활성화할까요?" description={`${deactivateTarget?.code ?? "선택한 라우트"}는 기존 스케줄·운임에서 유지되지만 신규 업무 선택 대상에서는 제외됩니다.`} confirmLabel={pendingDeactivate ? "처리 중" : "비활성화"} onCancel={() => setDeactivateId(null)} onConfirm={handleDeactivate} />
  </>;
}

function RouteEditorForm({ route, locations, onSuccess, onCancel }: { route: RouteRow | null; locations: LocationOption[]; onSuccess: (message: string) => void; onCancel: () => void }) {
  const [state, action, pending] = useActionState(saveRouteAction, INITIAL_STATE);
  const [mode, setMode] = useState<Mode>(route?.transportMode ?? "SEA");
  const available = locations.filter((location) => mode === "SEA" ? location.type === "PORT" : mode === "AIR" ? location.type === "AIRPORT" : true);
  useEffect(() => { if (state.success) onSuccess(state.message); }, [onSuccess, state]);
  return <form action={action} className="space-y-5">
    {route && <input type="hidden" name="id" value={route.id} />}
    <div className="grid gap-4 sm:grid-cols-2"><FormField label="라우트 코드" name="code" defaultValue={route?.code} placeholder="RT-SEA-KRPUS-CNSHA" /><label className="block text-sm font-semibold">운송 모드<select name="transportMode" value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="form-control mt-2">{Object.entries(MODE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <LocationSelect label="출발지" name="originId" defaultValue={route?.origin.id} options={available} /><LocationSelect label="도착지" name="destinationId" defaultValue={route?.destination.id} options={available} />
    <label className="flex items-start gap-3 rounded-xl border border-line p-4"><input type="checkbox" name="transshipmentAllowed" defaultChecked={route?.transshipmentAllowed ?? true} className="mt-1 h-4 w-4 accent-brand" /><span><strong className="block text-sm text-ink">환적 허용</strong><span className="mt-1 block text-xs text-muted">직항뿐 아니라 환적 스케줄과 운임도 이 라우트에 연결할 수 있습니다.</span></span></label>
    {state.message && !state.success && <p role="alert" className="rounded-lg bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">{state.message}</p>}
    <div className="flex justify-end gap-2 border-t border-line pt-5"><button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">취소</button><button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "저장 중" : "저장"}</button></div>
  </form>;
}

function LocationSelect({ label, name, defaultValue, options }: { label: string; name: string; defaultValue?: string; options: LocationOption[] }) {
  return <label className="block text-sm font-semibold">{label}<select name={name} required defaultValue={defaultValue ?? ""} className="form-control mt-2"><option value="" disabled>{label} 선택</option>{options.map((location) => <option key={location.id} value={location.id}>{locationLabel(location)}</option>)}</select></label>;
}

function FormField({ label, name, defaultValue = "", placeholder }: { label: string; name: string; defaultValue?: string; placeholder?: string }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} required defaultValue={defaultValue} placeholder={placeholder} className="form-control mt-2" /></label>;
}
