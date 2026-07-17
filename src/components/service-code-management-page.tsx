"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deactivateServiceCodeAction, saveServiceCodeAction, type ServiceCodeActionState } from "@/app/master-data/services/actions";
import { ConfirmDialog } from "./confirm-dialog";
import { CheckCircle, Clock, Database, Filter, Plus, Search } from "./icons";
import { Badge, DataTable, MockupPage, SectionCard, StatCard } from "./mockup";
import { SlideOver } from "./slide-over";

const INITIAL_STATE: ServiceCodeActionState = { success: false, message: "" };
const UNIT_LABEL = {
  SHIPMENT: "건별",
  KG: "kg",
  TON: "톤",
  CBM: "CBM",
  CONTAINER_20: "20ft 컨테이너",
  CONTAINER_40: "40ft 컨테이너",
  CONTAINER_40_HC: "40ft HC 컨테이너",
} as const;

type ServiceCodeRow = {
  id: string;
  code: string;
  nameKo: string;
  nameEn: string;
  defaultUnit: keyof typeof UNIT_LABEL;
  taxable: boolean;
  status: "ACTIVE" | "INACTIVE";
  _count: { surcharges: number };
};

export function ServiceCodeManagementPage({ serviceCodes }: { serviceCodes: ServiceCodeRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorId, setEditorId] = useState<string | "new" | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [pendingDeactivate, startDeactivate] = useTransition();
  const editing = editorId === "new" ? null : serviceCodes.find((item) => item.id === editorId) ?? null;
  const detail = serviceCodes.find((item) => item.id === detailId) ?? null;
  const deactivateTarget = serviceCodes.find((item) => item.id === deactivateId) ?? null;

  const filtered = useMemo(() => serviceCodes.filter((item) => {
    const text = [item.code, item.nameKo, item.nameEn, UNIT_LABEL[item.defaultUnit]].join(" ").toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (unitFilter === "all" || item.defaultUnit === unitFilter)
      && (statusFilter === "all" || item.status === statusFilter);
  }), [query, serviceCodes, statusFilter, unitFilter]);

  const handleSaved = (message: string) => { setEditorId(null); setNotice(message); router.refresh(); };
  const handleDeactivate = () => {
    if (!deactivateId) return;
    startDeactivate(async () => {
      const result = await deactivateServiceCodeAction(deactivateId);
      setNotice(result.message);
      if (result.success) { setDetailId(null); router.refresh(); }
      setDeactivateId(null);
    });
  };

  return <>
    <MockupPage eyebrow="기준 정보 관리 · Neon 연결" title="서비스·비용 코드 관리" icon={Database} description="부가 서비스와 비용 항목의 과금 단위 및 과세 여부를 관리합니다." actions={<button type="button" onClick={() => setEditorId("new")} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />코드 등록</button>}>
      {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-info/20 bg-info-soft px-4 py-3 text-sm font-semibold text-info"><span>{notice}</span><button type="button" aria-label="알림 닫기" onClick={() => setNotice("")} className="px-2">×</button></div>}
      <div className="grid gap-4 sm:grid-cols-3"><StatCard icon={Database} label="전체 코드" value={String(serviceCodes.length)} unit="개" /><StatCard icon={CheckCircle} label="활성" value={String(serviceCodes.filter((item) => item.status === "ACTIVE").length)} unit="개" tone="navy" /><StatCard icon={Clock} label="비활성" value={String(serviceCodes.filter((item) => item.status === "INACTIVE").length)} unit="개" tone="brand" /></div>
      <SectionCard title="서비스·비용 코드 목록" icon={Database}>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 lg:max-w-md"><Search className="h-4 w-4 text-faint" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="서비스 코드 검색" placeholder="코드, 한글명, 영문명 검색" className="w-full bg-transparent text-sm outline-none" /></label>
          <div className="flex flex-wrap gap-2"><select value={unitFilter} onChange={(event) => setUnitFilter(event.target.value)} aria-label="과금 단위 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 과금 단위</option>{Object.entries(UNIT_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="상태 필터" className="rounded-lg border border-line bg-white px-3 py-2 text-sm"><option value="all">전체 상태</option><option value="ACTIVE">활성</option><option value="INACTIVE">비활성</option></select><span className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-muted"><Filter className="h-4 w-4" />{filtered.length}건</span></div>
        </div>
        <DataTable columns={["서비스 코드", "서비스명", "영문명", "과금 단위", "과세", "연결 비용", "상태", "관리"]} rows={filtered.map((item) => [item.code, item.nameKo, item.nameEn, UNIT_LABEL[item.defaultUnit], <Badge key="tax" tone={item.taxable ? "warning" : "muted"}>{item.taxable ? "과세" : "비과세"}</Badge>, `${item._count.surcharges}건`, <Badge key="status" tone={item.status === "ACTIVE" ? "success" : "muted"}>{item.status === "ACTIVE" ? "활성" : "비활성"}</Badge>, <button key="detail" type="button" onClick={() => setDetailId(item.id)} className="font-semibold text-info hover:underline">상세</button>])} />
        {filtered.length === 0 && <p className="border-t border-line py-12 text-center text-sm text-muted">조건에 맞는 서비스 코드가 없습니다.</p>}
        <p className="mt-4 border-t border-line pt-4 text-sm text-muted">전체 {serviceCodes.length}개 중 {filtered.length}개 표시 · Neon 실데이터</p>
      </SectionCard>
    </MockupPage>
    <SlideOver open={Boolean(detail)} title="서비스 코드 상세" description="Neon에 저장된 서비스·비용 기준정보입니다." onClose={() => setDetailId(null)} footer={detail && <><button type="button" disabled={detail.status === "INACTIVE" || pendingDeactivate} onClick={() => setDeactivateId(detail.id)} className="mr-auto rounded-lg border border-brand/30 px-4 py-2 text-sm font-semibold text-brand disabled:opacity-40">비활성화</button><button type="button" onClick={() => { setEditorId(detail.id); setDetailId(null); }} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">수정</button></>}>
      {detail && <dl className="divide-y divide-line">{[["서비스 코드", detail.code], ["한글명", detail.nameKo], ["영문명", detail.nameEn], ["기본 과금 단위", UNIT_LABEL[detail.defaultUnit]], ["과세 여부", detail.taxable ? "과세" : "비과세"], ["연결 부대비용", `${detail._count.surcharges}건`], ["상태", detail.status === "ACTIVE" ? "활성" : "비활성"]].map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-[150px_1fr]"><dt className="text-sm font-semibold text-muted">{label}</dt><dd className="data text-sm text-ink">{value}</dd></div>)}</dl>}
    </SlideOver>
    <SlideOver open={Boolean(editorId)} title={editorId === "new" ? "서비스 코드 등록" : "서비스 코드 수정"} description="운임의 부대비용 계산에 사용할 기본 과금 정보를 입력합니다." onClose={() => setEditorId(null)}><ServiceCodeEditorForm key={editorId ?? "closed"} serviceCode={editing} onSuccess={handleSaved} onCancel={() => setEditorId(null)} /></SlideOver>
    <ConfirmDialog open={Boolean(deactivateTarget)} title="서비스 코드를 비활성화할까요?" description={`${deactivateTarget?.nameKo ?? "선택한 코드"}는 기존 운임에서 유지되지만 신규 부대비용 선택 대상에서는 제외됩니다.`} confirmLabel={pendingDeactivate ? "처리 중" : "비활성화"} onCancel={() => setDeactivateId(null)} onConfirm={handleDeactivate} />
  </>;
}

function ServiceCodeEditorForm({ serviceCode, onSuccess, onCancel }: { serviceCode: ServiceCodeRow | null; onSuccess: (message: string) => void; onCancel: () => void }) {
  const [state, action, pending] = useActionState(saveServiceCodeAction, INITIAL_STATE);
  useEffect(() => { if (state.success) onSuccess(state.message); }, [onSuccess, state]);
  return <form action={action} className="space-y-5">
    {serviceCode && <input type="hidden" name="id" value={serviceCode.id} />}
    <FormField label="서비스 코드" name="code" defaultValue={serviceCode?.code} placeholder="FUEL_SURCHARGE" />
    <div className="grid gap-4 sm:grid-cols-2"><FormField label="한글명" name="nameKo" defaultValue={serviceCode?.nameKo} /><FormField label="영문명" name="nameEn" defaultValue={serviceCode?.nameEn} /></div>
    <label className="block text-sm font-semibold">기본 과금 단위<select name="defaultUnit" defaultValue={serviceCode?.defaultUnit ?? "SHIPMENT"} className="form-control mt-2">{Object.entries(UNIT_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label className="flex items-start gap-3 rounded-xl border border-line p-4"><input type="checkbox" name="taxable" defaultChecked={serviceCode?.taxable ?? true} className="mt-1 h-4 w-4 accent-brand" /><span><strong className="block text-sm text-ink">과세 대상</strong><span className="mt-1 block text-xs text-muted">견적과 운임 계산에서 세금 적용 대상으로 사용합니다.</span></span></label>
    {state.message && !state.success && <p role="alert" className="rounded-lg bg-brand-soft px-3 py-2 text-sm font-semibold text-brand">{state.message}</p>}
    <div className="flex justify-end gap-2 border-t border-line pt-5"><button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold">취소</button><button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "저장 중" : "저장"}</button></div>
  </form>;
}

function FormField({ label, name, defaultValue = "", placeholder }: { label: string; name: string; defaultValue?: string; placeholder?: string }) {
  return <label className="block text-sm font-semibold">{label}<input name={name} required defaultValue={defaultValue} placeholder={placeholder} className="form-control mt-2" /></label>;
}
