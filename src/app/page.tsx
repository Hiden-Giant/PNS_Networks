"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import {
  Boxes,
  Box,
  Clock,
  Courier,
  Flag,
  Hazard,
  History,
  Mail,
  MapPin,
  Percent,
  Plane,
  Search,
  Shield,
  Ship,
  Snowflake,
  Sync,
  Truck,
  Warehouse,
  Close,
  Calendar,
  ChevronDown,
} from "@/components/icons";

type Mode = "sea" | "air";

type Schedule = {
  id: string;
  mode: Mode;
  carrier: string;
  vessel: string;
  originPort: string; // BUSAN | INCHEON
  originLabel: string;
  etd: string;
  destCountry: string; // 표시/필터용 국가명
  destLabel: string;
  eta: string;
  price: string;
  priceNote: string;
  services: string[];
  extraServices?: number;
};

const SCHEDULES: Schedule[] = [
  {
    id: "zim-18s",
    mode: "sea",
    carrier: "PNS",
    vessel: "ZIM AUSTRALIA 18S",
    originPort: "INCHEON",
    originLabel: "KR INCHEON (Port)",
    etd: "2024-01-12 (Fri)",
    destCountry: "싱가포르",
    destLabel: "SG Singapore Port",
    eta: "2024-01-26 (Fri)",
    price: "USD 1,240.00",
    priceNote: "Incl. THC & Bunker",
    services: ["픽업", "보험"],
    extraServices: 2,
  },
  {
    id: "ke-0643",
    mode: "air",
    carrier: "KOREAN AIR CARGO",
    vessel: "KE 0643 (Direct)",
    originPort: "INCHEON",
    originLabel: "KR INCHEON (Airport)",
    etd: "2024-01-08 (Mon)",
    destCountry: "싱가포르",
    destLabel: "SG Changi Airport",
    eta: "2024-01-09 (Tue)",
    price: "USD 3,850.00",
    priceNote: "Priority Handling",
    services: ["특급", "컨시어지"],
  },
  {
    id: "kmtc-hcm22",
    mode: "sea",
    carrier: "KMTC LINE",
    vessel: "KMTC HOCHIMINH 22W",
    originPort: "BUSAN",
    originLabel: "KR BUSAN (Port)",
    etd: "2024-01-14 (Sun)",
    destCountry: "베트남",
    destLabel: "VN HAIPHONG Port",
    eta: "2024-01-22 (Mon)",
    price: "USD 890.00",
    priceNote: "Incl. THC",
    services: ["픽업", "보험", "통관"],
    extraServices: 1,
  },
  {
    id: "sitc-sha07",
    mode: "sea",
    carrier: "SITC",
    vessel: "SITC SHANGHAI 07E",
    originPort: "BUSAN",
    originLabel: "KR BUSAN (Port)",
    etd: "2024-01-10 (Wed)",
    destCountry: "중국",
    destLabel: "CN SHANGHAI Port",
    eta: "2024-01-15 (Mon)",
    price: "USD 640.00",
    priceNote: "Incl. THC & Doc",
    services: ["픽업"],
    extraServices: 2,
  },
  {
    id: "cx-0417",
    mode: "air",
    carrier: "CATHAY CARGO",
    vessel: "CX 0417 (1-Stop)",
    originPort: "INCHEON",
    originLabel: "KR INCHEON (Airport)",
    etd: "2024-01-11 (Thu)",
    destCountry: "홍콩",
    destLabel: "HK Hong Kong Intl",
    eta: "2024-01-11 (Thu)",
    price: "USD 2,120.00",
    priceNote: "Express Handling",
    services: ["특급", "보험"],
  },
  {
    id: "one-la15",
    mode: "sea",
    carrier: "ONE (Ocean Network)",
    vessel: "ONE COLUMBA 15E",
    originPort: "BUSAN",
    originLabel: "KR BUSAN (Port)",
    etd: "2024-01-16 (Tue)",
    destCountry: "미국",
    destLabel: "US LOS ANGELES Port",
    eta: "2024-02-01 (Thu)",
    price: "USD 2,980.00",
    priceNote: "Incl. THC & Bunker",
    services: ["픽업", "보험"],
    extraServices: 3,
  },
  {
    id: "ana-1075",
    mode: "air",
    carrier: "ANA CARGO",
    vessel: "NH 1075 (Direct)",
    originPort: "INCHEON",
    originLabel: "KR INCHEON (Airport)",
    etd: "2024-01-09 (Tue)",
    destCountry: "일본",
    destLabel: "JP NARITA Airport",
    eta: "2024-01-09 (Tue)",
    price: "USD 1,480.00",
    priceNote: "Priority Handling",
    services: ["특급", "컨시어지"],
    extraServices: 1,
  },
  {
    id: "hmm-eu09",
    mode: "sea",
    carrier: "HMM",
    vessel: "HMM ROTTERDAM 09W",
    originPort: "BUSAN",
    originLabel: "KR BUSAN (Port)",
    etd: "2024-01-18 (Thu)",
    destCountry: "네덜란드",
    destLabel: "NL ROTTERDAM Port",
    eta: "2024-02-20 (Tue)",
    price: "USD 3,420.00",
    priceNote: "Incl. THC & Bunker",
    services: ["픽업", "보험", "통관"],
    extraServices: 2,
  },
  {
    id: "emirates-9863",
    mode: "air",
    carrier: "EMIRATES SKYCARGO",
    vessel: "EK 9863 (1-Stop)",
    originPort: "INCHEON",
    originLabel: "KR INCHEON (Airport)",
    etd: "2024-01-13 (Sat)",
    destCountry: "UAE",
    destLabel: "AE DUBAI Airport",
    eta: "2024-01-14 (Sun)",
    price: "USD 4,260.00",
    priceNote: "DG Cargo Ready",
    services: ["특급", "위험물"],
    extraServices: 1,
  },
];

const ORIGIN_PORTS = ["전체", "BUSAN", "INCHEON"];
const DEST_COUNTRIES = [
  "전체",
  "싱가포르",
  "베트남",
  "중국",
  "홍콩",
  "미국",
  "일본",
  "네덜란드",
  "UAE",
];

const ADDON_SERVICES = [
  { label: "LCL 화물", icon: Box },
  { label: "혼적", icon: Boxes, highlight: true },
  { label: "창고 보관", icon: Warehouse },
  { label: "콜드체인", icon: Snowflake },
  { label: "위험물", icon: Hazard },
  { label: "서류 지원", icon: Mail },
  { label: "국제 택배", icon: Courier },
];

type Filters = { originPort: string; destCountry: string };

export default function SchedulesPage() {
  const [tab, setTab] = useState<"regular" | "special">("regular");

  // 폼 입력값
  const [originPort, setOriginPort] = useState("전체");
  const [destCountry, setDestCountry] = useState("전체");
  const [dateRange, setDateRange] = useState("2024-01-05 ~ 2024-02-04");
  const [cargoUnit, setCargoUnit] = useState("CBM");
  const [cargoValue, setCargoValue] = useState("10");

  // 실제 적용된 검색 조건
  const [filters, setFilters] = useState<Filters>({
    originPort: "전체",
    destCountry: "전체",
  });

  const results = useMemo(
    () =>
      SCHEDULES.filter(
        (s) =>
          (filters.originPort === "전체" ||
            s.originPort === filters.originPort) &&
          (filters.destCountry === "전체" ||
            s.destCountry === filters.destCountry),
      ),
    [filters],
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    SCHEDULES[0].id,
  );
  const selected = results.find((s) => s.id === selectedId) ?? null;

  const runSearch = () => {
    const next = { originPort, destCountry };
    setFilters(next);
    const nextResults = SCHEDULES.filter(
      (s) =>
        (next.originPort === "전체" || s.originPort === next.originPort) &&
        (next.destCountry === "전체" || s.destCountry === next.destCountry),
    );
    setSelectedId(nextResults.length ? nextResults[0].id : null);
  };

  return (
    <>
      <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-8 lg:px-10">
        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-line">
          <button
            type="button"
            onClick={() => setTab("regular")}
            className={`flex items-center gap-2 rounded-t-xl px-6 py-4 text-sm font-semibold transition-colors ${
              tab === "regular"
                ? "bg-navy text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            <Clock className="h-4 w-4" />
            정기 스케줄
          </button>
          <button
            type="button"
            onClick={() => setTab("special")}
            className={`flex items-center gap-2 rounded-t-xl px-6 py-4 text-sm font-semibold transition-colors ${
              tab === "special"
                ? "bg-navy text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            <Percent className="h-4 w-4" />
            특가 할인 구간
          </button>
        </div>

        {/* Search & filter bento grid */}
        <section className="mb-12 grid gap-6 lg:grid-cols-[1fr_402px]">
          <SearchCard
            originPort={originPort}
            setOriginPort={setOriginPort}
            destCountry={destCountry}
            setDestCountry={setDestCountry}
            dateRange={dateRange}
            setDateRange={setDateRange}
            cargoUnit={cargoUnit}
            setCargoUnit={setCargoUnit}
            cargoValue={cargoValue}
            setCargoValue={setCargoValue}
            onSearch={runSearch}
          />
          <PromoBanner />
        </section>

        {/* Results header */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-ink">
            이용 가능 스케줄
            <span className="data rounded-full bg-info-soft px-3 py-1 text-xs font-medium text-info">
              {results.length}건 검색됨
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
              <History className="h-4 w-4" />
              이용 내역 보기
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-navy-2">
              <Sync className="h-4 w-4" />
              스마트 화물 동기화
            </button>
          </div>
        </div>

        {/* Results table */}
        {results.length > 0 ? (
          <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-sm">
            <div className="min-w-[960px]">
            <div className="grid grid-cols-[80px_1.6fr_1.4fr_1.4fr_1.2fr_1.6fr_120px] gap-4 border-b border-line bg-canvas/70 px-6 py-3">
              {[
                "운송",
                "선사 정보",
                "출항 (ETD)",
                "도착 (ETA)",
                "예상 운임",
                "부가 서비스",
                "선택",
              ].map((h) => (
                <span key={h} className="eyebrow">
                  {h}
                </span>
              ))}
            </div>

            {results.map((s) => (
              <ScheduleRow
                key={s.id}
                schedule={s}
                active={s.id === selectedId}
                onSelect={() => setSelectedId(s.id)}
              />
            ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface p-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas text-faint">
              <Search className="h-7 w-7" />
            </div>
            <p className="mt-4 font-semibold text-ink">
              조건에 맞는 스케줄이 없습니다
            </p>
            <p className="mt-1 text-sm text-muted">
              출발 항구 또는 도착 국가를 변경해 다시 검색해 주세요.
            </p>
          </div>
        )}

        {/* Detail view */}
        {selected && (
          <DetailView
            schedule={selected}
            onClose={() => setSelectedId(null)}
          />
        )}
      </main>

      <SiteFooter />
    </>
  );
}

function SearchCard({
  originPort,
  setOriginPort,
  destCountry,
  setDestCountry,
  dateRange,
  setDateRange,
  cargoUnit,
  setCargoUnit,
  cargoValue,
  setCargoValue,
  onSearch,
}: {
  originPort: string;
  setOriginPort: (v: string) => void;
  destCountry: string;
  setDestCountry: (v: string) => void;
  dateRange: string;
  setDateRange: (v: string) => void;
  cargoUnit: string;
  setCargoUnit: (v: string) => void;
  cargoValue: string;
  setCargoValue: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold text-ink">경로 상세</h2>
        <p className="text-xs text-muted">
          * 원하는 경로가 없으면 맞춤 견적을 요청해 주세요.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field icon={<MapPin className="h-3.5 w-3.5" />} label="출발지 (국가 / 항구)">
          <div className="grid grid-cols-[1fr_130px] gap-2">
            <SelectBox value="South Korea" onChange={() => {}} options={["South Korea"]} />
            <SelectBox value={originPort} onChange={setOriginPort} options={ORIGIN_PORTS} />
          </div>
        </Field>

        <Field icon={<Flag className="h-3.5 w-3.5" />} label="도착지 (국가 / 항구)">
          <SelectBox value={destCountry} onChange={setDestCountry} options={DEST_COUNTRIES} />
        </Field>

        <Field label="출항 일정 범위">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="data w-full rounded-xl border border-line bg-canvas/50 py-3 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-brand focus:bg-surface"
            />
          </div>
        </Field>

        <Field label="화물 예상 (CBM/중량)">
          <div className="grid grid-cols-[110px_1fr] gap-2">
            <SelectBox value={cargoUnit} onChange={setCargoUnit} options={["CBM", "Kg", "Ton"]} />
            <input
              type="number"
              value={cargoValue}
              onChange={(e) => setCargoValue(e.target.value)}
              className="data w-full rounded-xl border border-line bg-canvas/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-surface"
            />
          </div>
        </Field>
      </div>

      <div className="mt-7 flex justify-center">
        <button
          onClick={onSearch}
          className="flex items-center gap-2 rounded-xl bg-brand px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark"
        >
          <Search className="h-5 w-5" />
          스케줄 검색
        </button>
      </div>
    </div>
  );
}

function PromoBanner() {
  return (
    <div className="relative flex flex-col justify-end overflow-hidden rounded-card bg-navy p-8 text-white shadow-sm">
      <div className="absolute -right-6 -top-6 opacity-10">
        <Truck className="h-40 w-40" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 90% at 80% 10%, rgba(200,16,46,0.35) 0%, rgba(11,18,32,0) 55%)",
        }}
      />
      <div className="relative">
        <span className="data inline-block rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold tracking-wide">
          특가 세일
        </span>
        <h3 className="mt-4 text-2xl font-bold leading-snug">
          국제 운송 프로모션
        </h3>
        <p className="mt-3 text-sm leading-6 text-white/70">
          항공 1Kg·해상 1CBM 최저가. 계약 판매자 대상 혜택입니다.
        </p>
        <button className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-white/90">
          자세히 보기
        </button>
      </div>
    </div>
  );
}

function ScheduleRow({
  schedule: s,
  active,
  onSelect,
}: {
  schedule: Schedule;
  active: boolean;
  onSelect: () => void;
}) {
  const ModeIcon = s.mode === "sea" ? Ship : Plane;
  return (
    <div
      className={`grid grid-cols-[80px_1.6fr_1.4fr_1.4fr_1.2fr_1.6fr_120px] items-center gap-4 border-b border-line px-6 py-5 transition-colors last:border-0 ${
        active ? "bg-brand-soft/60" : "hover:bg-canvas/40"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          active ? "bg-brand text-white" : "bg-canvas text-ink"
        }`}
      >
        <ModeIcon className="h-6 w-6" />
      </div>

      <div>
        <p className="font-semibold text-ink">{s.carrier}</p>
        <p className="data mt-0.5 text-xs text-muted">{s.vessel}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-ink">{s.originLabel}</p>
        <p className="data mt-0.5 text-xs text-brand">{s.etd}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-ink">{s.destLabel}</p>
        <p className="data mt-0.5 text-xs text-muted">{s.eta}</p>
      </div>

      <div>
        <p className="data font-bold text-ink">{s.price}</p>
        <p className="mt-0.5 text-xs text-muted">{s.priceNote}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {s.services.map((svc) => (
          <span
            key={svc}
            className="flex items-center gap-1 rounded-md bg-info-soft px-2 py-1 text-xs font-medium text-info"
          >
            <Shield className="h-3 w-3" />
            {svc}
          </span>
        ))}
        {s.extraServices ? (
          <span className="text-xs font-medium text-brand">
            +{s.extraServices}개 더보기
          </span>
        ) : null}
      </div>

      <button
        onClick={onSelect}
        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
          active
            ? "bg-brand text-white hover:bg-brand-dark"
            : "bg-navy text-white hover:bg-navy-2"
        }`}
      >
        {active ? "선택됨" : "선택"}
      </button>
    </div>
  );
}

function DetailView({
  schedule,
  onClose,
}: {
  schedule: Schedule;
  onClose: () => void;
}) {
  const [selectedAddon, setSelectedAddon] = useState("혼적");
  return (
    <div className="mt-6 rounded-card border border-line bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-8">
        <h3 className="flex flex-wrap items-center gap-2 text-base font-bold text-ink sm:text-lg">
          상세 보기: {schedule.vessel}
          <span className="data rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info">
            {schedule.carrier}
          </span>
        </h3>
        <button
          onClick={onClose}
          aria-label="상세 보기 닫기"
          className="text-faint transition-colors hover:text-ink"
        >
          <Close className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-7 lg:grid-cols-[340px_1fr]">
        {/* Left: route timeline */}
        <div className="relative lg:border-r lg:border-line lg:pr-8">
          <div className="absolute left-[5px] top-3 h-[calc(100%-40px)] w-px border-l border-dashed border-line" />
          <RoutePoint
            color="bg-brand"
            label="출항"
            place={schedule.originLabel}
            date={schedule.etd}
          />
          <div className="h-12" />
          <RoutePoint
            color="bg-navy"
            label="도착"
            place={schedule.destLabel}
            date={schedule.eta}
          />

          <div className="mt-8 rounded-xl bg-canvas p-4">
            <p className="eyebrow mb-1">예상 운임</p>
            <p className="data text-xl font-bold text-ink">{schedule.price}</p>
            <p className="mt-0.5 text-xs text-muted">{schedule.priceNote}</p>
          </div>
        </div>

        {/* Right: add-on services */}
        <div>
          <p className="eyebrow mb-4">이용 가능 부가 서비스</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ADDON_SERVICES.map((svc) => {
              const Icon = svc.icon;
              const active = selectedAddon === svc.label;
              return (
                <button
                  key={svc.label}
                  onClick={() => setSelectedAddon(svc.label)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                    active
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-line bg-surface text-ink-soft hover:border-faint"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{svc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-line px-8 py-5">
        <button className="rounded-xl bg-brand px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark">
          예약 진행
        </button>
      </div>
    </div>
  );
}

function RoutePoint({
  color,
  label,
  place,
  date,
}: {
  color: string;
  label: string;
  place: string;
  date: string;
}) {
  return (
    <div className="relative pl-8">
      <span className={`absolute left-0 top-1 h-3 w-3 rounded-full ring-4 ring-surface ${color}`} />
      <p className="eyebrow">{label}</p>
      <p className="mt-1 font-semibold text-ink">{place}</p>
      <p className="data mt-0.5 text-sm text-brand">{date}</p>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="eyebrow mb-2 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-line bg-canvas/50 py-3 pl-4 pr-9 text-sm font-medium text-ink outline-none transition focus:border-brand focus:bg-surface"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
    </div>
  );
}
