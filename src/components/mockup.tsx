import type { ComponentType, ReactNode, SVGProps } from "react";
import { SiteFooter } from "./site-footer";
import { ArrowUpRight, TrendDown, TrendUp } from "./icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export function MockupPage({
  eyebrow,
  title,
  icon: Icon,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: IconType;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">{eyebrow}</p>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-ink">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-6 w-6" />
              </span>
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        <div className="space-y-8">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  tone = "default",
}: {
  icon: IconType;
  label: string;
  value: string;
  unit?: string;
  trend?: { dir: "up" | "down"; value: string };
  tone?: "default" | "brand" | "navy";
}) {
  const toneCls =
    tone === "brand"
      ? "bg-brand text-white"
      : tone === "navy"
        ? "bg-navy text-white"
        : "bg-surface text-ink border border-line";
  const subtle = tone === "default" ? "text-muted" : "text-white/60";
  const iconWrap =
    tone === "default" ? "bg-brand-soft text-brand" : "bg-white/10 text-white";

  return (
    <div className={`rounded-card p-5 shadow-sm ${toneCls}`}>
      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconWrap}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend.dir === "up" ? "text-emerald-500" : "text-brand"
            } ${tone !== "default" ? "!text-white/80" : ""}`}
          >
            {trend.dir === "up" ? (
              <TrendUp className="h-3.5 w-3.5" />
            ) : (
              <TrendDown className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <p className={`mt-4 text-xs ${subtle}`}>{label}</p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="data text-2xl font-bold">{value}</span>
        {unit && <span className={`text-sm ${subtle}`}>{unit}</span>}
      </p>
    </div>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className = "",
}: {
  title: string;
  icon?: IconType;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-card border border-line bg-surface shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="flex items-center gap-2 text-base font-bold text-ink">
          {Icon && <Icon className="h-5 w-5 text-brand" />}
          {title}
        </h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c) => (
              <th key={c} className="eyebrow whitespace-nowrap px-4 py-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-line last:border-0 hover:bg-canvas/50"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="whitespace-nowrap px-4 py-3.5 text-sm text-ink"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Badge({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "danger" | "muted";
}) {
  const map = {
    info: "bg-info-soft text-info",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-brand-soft text-brand",
    muted: "bg-canvas text-muted",
  };
  return (
    <span
      className={`data inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function LinkRow({
  title,
  meta,
  tag,
}: {
  title: string;
  meta: string;
  tag?: string;
}) {
  return (
    <a
      href="#"
      className="group flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 transition-colors hover:border-brand/40 hover:bg-canvas/50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink group-hover:text-brand">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-muted">{meta}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {tag && <Badge tone="muted">{tag}</Badge>}
        <ArrowUpRight className="h-4 w-4 text-faint group-hover:text-brand" />
      </div>
    </a>
  );
}
