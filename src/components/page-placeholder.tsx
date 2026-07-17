import type { ComponentType, SVGProps } from "react";
import { SiteFooter } from "./site-footer";

export function PagePlaceholder({
  icon: Icon,
  title,
  subtitle,
  description,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <>
      <main className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-10 lg:px-10">
        <div className="mb-8">
          <p className="eyebrow mb-2">{subtitle}</p>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-ink">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Icon className="h-6 w-6" />
            </span>
            {title}
          </h1>
        </div>
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-canvas text-faint">
            <Icon className="h-8 w-8" />
          </div>
          <p className="mt-6 text-lg font-semibold text-ink">{title}</p>
          <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
          <span className="data mt-6 rounded-full bg-info-soft px-4 py-1.5 text-xs font-medium text-info">
            화면 구조 준비 완료 · 데이터 연결 예정
          </span>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
