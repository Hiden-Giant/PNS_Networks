"use client";

import { useMemo, useState, type ComponentType, type FormEvent, type SVGProps } from "react";
import { Badge, DataTable, MockupPage, SectionCard, StatCard } from "./mockup";
import { ConfirmDialog } from "./confirm-dialog";
import { SlideOver } from "./slide-over";
import { CheckCircle, Clock, Filter, Plus, Search } from "./icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
type StatusTone = "success" | "warning" | "danger" | "muted" | "info";

export type ManagementRow = {
  id: string;
  cells: readonly string[];
  status: { label: string; tone: StatusTone };
};

export function ManagementListPage({
  icon,
  title,
  description,
  registerLabel,
  searchPlaceholder,
  columns,
  rows: initialRows,
}: {
  icon: IconType;
  title: string;
  description: string;
  registerLabel: string;
  searchPlaceholder: string;
  columns: readonly string[];
  rows: readonly ManagementRow[];
}) {
  const [rows, setRows] = useState<ManagementRow[]>(() => initialRows.map((row) => ({ ...row, cells: [...row.cells] })));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [codeFilter, setCodeFilter] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
  const [draft, setDraft] = useState<string[]>(() => columns.map(() => ""));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);

  const selectedRow = rows.find((row) => row.id === selectedId) ?? null;
  const deactivateRow = rows.find((row) => row.id === deactivateId) ?? null;
  const activeCount = rows.filter((row) => row.status.tone === "success").length;

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCode = codeFilter.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !normalizedQuery || [...row.cells, row.status.label].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? row.status.tone === "success" : row.status.tone !== "success");
      const matchesCode = !normalizedCode || row.cells[0]?.toLowerCase().startsWith(normalizedCode);
      return matchesQuery && matchesStatus && matchesCode;
    });
  }, [codeFilter, query, rows, statusFilter]);

  const openCreate = () => {
    setDraft(columns.map(() => ""));
    setEditorMode("create");
  };

  const saveDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editorMode === "create") {
      const newId = `${title}-${Date.now()}`;
      setRows((current) => [...current, { id: newId, cells: [...draft], status: { label: "활성", tone: "success" } }]);
    } else if (selectedRow) {
      setRows((current) => current.map((row) => row.id === selectedRow.id ? { ...row, cells: [...draft] } : row));
    } else {
      const editingId = deactivateId;
      if (editingId) setRows((current) => current.map((row) => row.id === editingId ? { ...row, cells: [...draft] } : row));
    }
    setEditorMode(null);
    setDeactivateId(null);
  };

  const startEdit = (row: ManagementRow) => {
    setDraft([...row.cells]);
    setDeactivateId(row.id);
    setSelectedId(null);
    setEditorMode("edit");
  };

  const confirmDeactivate = () => {
    if (!deactivateId) return;
    setRows((current) => current.map((row) => row.id === deactivateId ? { ...row, status: { label: "비활성", tone: "muted" } } : row));
    setSelectedId(null);
    setDeactivateId(null);
  };

  return (
    <>
      <MockupPage eyebrow="기준 정보 관리" title={title} icon={icon} description={description} actions={
        <button type="button" onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          <Plus className="h-4 w-4" />{registerLabel}
        </button>
      }>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={icon} label="전체" value={String(rows.length)} unit="건" />
          <StatCard icon={CheckCircle} label="활성" value={String(activeCount)} unit="건" tone="navy" />
          <StatCard icon={Clock} label="검토 필요" value={String(rows.length - activeCount)} unit="건" tone="brand" />
        </div>

        <SectionCard title={`${title} 목록`} icon={icon}>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 md:max-w-md">
              <Search className="h-4 w-4 shrink-0 text-faint" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label={`${title} 검색`} placeholder={searchPlaceholder} className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint" />
            </label>
            <div className="flex items-center gap-2">
              <select aria-label="상태 필터" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-soft outline-none">
                <option value="all">전체 상태</option><option value="active">활성</option><option value="review">검토·비활성</option>
              </select>
              <button type="button" aria-expanded={showAdvancedFilter} onClick={() => setShowAdvancedFilter((current) => !current)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${showAdvancedFilter ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-soft hover:bg-canvas"}`}>
                <Filter className="h-4 w-4" />상세 필터
              </button>
            </div>
          </div>

          {showAdvancedFilter && (
            <div className="mb-5 flex flex-col gap-3 rounded-xl border border-line bg-canvas/70 p-4 sm:flex-row sm:items-end">
              <label className="flex-1 text-xs font-semibold text-ink-soft">{columns[0]} 시작값
                <input value={codeFilter} onChange={(event) => setCodeFilter(event.target.value)} placeholder="예: CUS, CAR, KR" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-normal text-ink outline-none focus:border-info" />
              </label>
              <button type="button" onClick={() => { setCodeFilter(""); setStatusFilter("all"); setQuery(""); }} className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-canvas">필터 초기화</button>
            </div>
          )}

          <DataTable columns={[...columns, "상태", "관리"]} rows={filteredRows.map((row) => [
            ...row.cells,
            <Badge key={`${row.id}-status`} tone={row.status.tone}>{row.status.label}</Badge>,
            <button key={`${row.id}-detail`} type="button" onClick={() => setSelectedId(row.id)} className="text-sm font-semibold text-info hover:underline">상세</button>,
          ])} />

          {filteredRows.length === 0 && <div className="border-t border-line py-12 text-center text-sm text-muted">검색 조건에 맞는 항목이 없습니다.</div>}
          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>전체 {rows.length}건 중 {filteredRows.length}건 표시 · mock data</p>
            <div className="flex items-center gap-1"><button type="button" disabled className="rounded-md border border-line px-3 py-1.5 disabled:opacity-40">이전</button><span className="rounded-md bg-brand px-3 py-1.5 font-semibold text-white">1</span><button type="button" disabled className="rounded-md border border-line px-3 py-1.5 disabled:opacity-40">다음</button></div>
          </div>
        </SectionCard>
      </MockupPage>

      <SlideOver open={Boolean(selectedRow)} title={`${title} 상세`} description="현재 화면의 mock 데이터입니다." onClose={() => setSelectedId(null)} footer={selectedRow && <><button type="button" onClick={() => setDeactivateId(selectedRow.id)} className="mr-auto rounded-lg border border-brand/30 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft">비활성 처리</button><button type="button" onClick={() => startEdit(selectedRow)} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">수정</button></>}>
        {selectedRow && <dl className="divide-y divide-line">{columns.map((column, index) => <div key={column} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr]"><dt className="text-sm font-semibold text-muted">{column}</dt><dd className="data text-sm text-ink">{selectedRow.cells[index] || "-"}</dd></div>)}<div className="grid gap-1 py-4 sm:grid-cols-[140px_1fr]"><dt className="text-sm font-semibold text-muted">상태</dt><dd><Badge tone={selectedRow.status.tone}>{selectedRow.status.label}</Badge></dd></div></dl>}
      </SlideOver>

      <SlideOver open={Boolean(editorMode)} title={editorMode === "create" ? registerLabel : `${title} 수정`} description="필수 정보를 입력한 뒤 저장하세요. 현재는 브라우저 mock 상태에만 반영됩니다." onClose={() => { setEditorMode(null); setDeactivateId(null); }} footer={<><button type="button" onClick={() => { setEditorMode(null); setDeactivateId(null); }} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-canvas">취소</button><button type="submit" form="management-editor" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">저장</button></>}>
        <form id="management-editor" onSubmit={saveDraft} className="space-y-5">{columns.map((column, index) => <label key={column} className="block text-sm font-semibold text-ink">{column}<input required value={draft[index] ?? ""} onChange={(event) => setDraft((current) => current.map((value, currentIndex) => currentIndex === index ? event.target.value : value))} className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal text-ink outline-none focus:border-info focus:ring-2 focus:ring-info-soft" /></label>)}</form>
      </SlideOver>

      <ConfirmDialog open={Boolean(deactivateRow && !editorMode)} title="항목을 비활성 처리할까요?" description={`${deactivateRow?.cells[1] ?? deactivateRow?.cells[0] ?? "선택한 항목"}은 목록에 유지되지만 신규 업무에서 선택할 수 없는 상태로 전환됩니다.`} confirmLabel="비활성 처리" onCancel={() => setDeactivateId(null)} onConfirm={confirmDeactivate} />
    </>
  );
}
