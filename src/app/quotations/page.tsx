"use client";

import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import {
  Box,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plane,
  Ship,
  Truck,
} from "@/components/icons";

const STEPS = [
  { no: "01", title: "경로 및 화물", state: "선택된 단계" },
  { no: "02", title: "연락처 정보", state: "대기 중" },
  { no: "03", title: "서류 제출", state: "대기 중" },
];

const SUMMARY = [
  { label: "출발지", value: "KR PUSAN" },
  { label: "도착지", value: "JP TOKYO" },
  { label: "운송", value: "SEA" },
  { label: "일정", value: "2024.05.01" },
];

const TRANSPORT = [
  { id: "sea", label: "해상", icon: Ship },
  { id: "air", label: "항공", icon: Plane },
  { id: "land", label: "육상", icon: Truck },
] as const;

const ESTIMATE = [
  { label: "운송 수단", value: "항공" },
  { label: "출항 날짜", value: "2021.04.25" },
  { label: "출항 장소", value: "인천 국제 공항" },
  { label: "CBM", value: "2.5 CBM" },
];

export default function QuotationsPage() {
  const [transport, setTransport] = useState<string>("air");

  return (
    <>
      <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[207px_1fr] xl:grid-cols-[207px_1fr_322px]">
          {/* Left sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-card bg-navy p-6 text-white">
              <h1 className="text-xl font-black leading-tight">PNS 견적 문의</h1>
              <p className="data mt-3 text-xs tracking-wide text-white/50">
                ITEM NO. SCP 1254596
              </p>
            </div>

            <Stepper />

            <div className="rounded-card border border-line bg-surface p-4">
              <p className="eyebrow mb-3">선택 요약</p>
              <dl className="space-y-2">
                {SUMMARY.map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="data font-semibold text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          {/* Main content */}
          <section className="rounded-card border border-line bg-surface shadow-sm">
            <div className="border-b border-line px-5 py-5 sm:px-8 sm:py-6">
              <h2 className="flex items-center gap-2.5 text-xl font-bold text-ink sm:text-2xl">
                <MapPin className="h-5 w-5 text-brand" />
                Step 1. 운송 정보 입력
              </h2>
            </div>

            <div className="space-y-8 px-5 py-6 sm:space-y-10 sm:px-8 sm:py-8">
              {/* Cargo route */}
              <Block label="화물 경로">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill>KOREA</Pill>
                  <Pill>PUSAN Port</Pill>
                  <ChevronRight className="h-5 w-5 text-faint" />
                  <Pill>JAPAN</Pill>
                  <Pill>TOKYO Port</Pill>
                </div>
              </Block>

              {/* Transportation type */}
              <Block label="운송 수단">
                <div className="grid grid-cols-3 gap-4">
                  {TRANSPORT.map((t) => {
                    const Icon = t.icon;
                    const active = transport === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTransport(t.id)}
                        className={`flex flex-col items-center justify-center gap-3 rounded-xl border py-7 transition-colors ${
                          active
                            ? "border-brand bg-brand-soft text-brand"
                            : "border-line bg-surface text-ink-soft hover:border-faint"
                        }`}
                      >
                        <Icon className="h-8 w-8" />
                        <span className="text-sm font-semibold">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Block>

              {/* Schedule */}
              <Block label="일정">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span className="w-36 text-sm font-medium text-ink-soft">
                    출항 일자
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      defaultValue="2021.04.25"
                      className="data w-full rounded-xl border border-line bg-canvas/50 py-3.5 pl-4 pr-12 text-sm text-ink outline-none transition focus:border-brand focus:bg-surface"
                    />
                    <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand" />
                  </div>
                </div>
              </Block>

              {/* Expected cargo */}
              <Block label="예상 화물 정보">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-xl bg-canvas text-faint">
                    <Box className="h-14 w-14" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <FormRow label="단위 선택">
                      <div className="relative">
                        <select
                          defaultValue="Kg"
                          className="w-full appearance-none rounded-xl border border-line bg-surface py-3.5 pl-4 pr-10 text-sm font-medium text-ink outline-none transition focus:border-brand"
                        >
                          <option>Kg</option>
                          <option>CBM</option>
                          <option>Ton</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                      </div>
                    </FormRow>

                    <FormRow label="중량 / 부피">
                      <input
                        type="text"
                        placeholder="값을 입력하세요..."
                        className="data w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-faint focus:border-brand"
                      />
                    </FormRow>

                    <FormRow label="가용 CBM">
                      <div className="data rounded-xl border border-info-soft bg-info-soft px-4 py-3.5 text-sm font-semibold text-info">
                        30
                      </div>
                    </FormRow>
                  </div>
                </div>
              </Block>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-line px-5 py-5 sm:gap-4 sm:px-8 sm:py-6">
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-line px-6 py-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-canvas sm:px-8">
                <ChevronLeft className="h-4 w-4" />
                이전
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand py-4 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark">
                다음 단계로 이동
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Right summary */}
          <aside className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
            <div className="overflow-hidden rounded-card bg-navy text-white shadow-sm">
              <div
                className="flex h-32 items-center justify-center"
                style={{
                  background:
                    "radial-gradient(120% 120% at 50% 0%, rgba(200,16,46,0.35) 0%, rgba(11,18,32,0) 60%)",
                }}
              >
                <Ship className="h-16 w-16 text-white/80" />
              </div>

              <div className="px-6 pb-6">
                <p className="eyebrow !text-white/40">견적 요약</p>
                <h3 className="mt-1 text-xl font-bold">실시간 견적 요약</h3>

                <dl className="mt-5 space-y-3 border-t border-white/10 pt-5">
                  {ESTIMATE.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <dt className="text-white/50">{row.label}</dt>
                      <dd className="data font-semibold text-white">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm text-white/60">예상 배송비</span>
                  <span className="data text-xl font-bold text-white">
                    KRW 235,000
                  </span>
                </div>
              </div>
            </div>

            <p className="rounded-xl border-l-4 border-info bg-info-soft px-4 py-3 text-xs leading-5 text-ink-soft">
              ** 순수 중량 및 부피에 따른 예상 배송비 입니다. 수출 수입 통관
              과정에서 추가 부대 비용은 미포함되어 있습니다.
            </p>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Stepper() {
  return (
    <ol className="rounded-card border border-line bg-surface p-5">
      {STEPS.map((step, i) => {
        const active = step.state === "선택된 단계";
        return (
          <li key={step.no} className="relative flex gap-4 pb-8 last:pb-0">
            {i < STEPS.length - 1 && (
              <span className="absolute left-5 top-10 h-[calc(100%-40px)] w-px bg-line" />
            )}
            <span
              className={`data flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                active
                  ? "bg-brand text-white"
                  : "border border-line text-faint"
              }`}
            >
              {step.no}
            </span>
            <div className="pt-1">
              <p
                className={`text-sm font-semibold ${
                  active ? "text-brand" : "text-ink"
                }`}
              >
                {step.title}
              </p>
              <p className="mt-0.5 text-xs text-muted">{step.state}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow mb-4">{label}</p>
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink shadow-sm">
      {children}
    </span>
  );
}

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-32 text-sm font-medium text-ink-soft">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
