import { SiteFooter } from "@/components/site-footer";
import { History } from "@/components/icons";

export default function HistoryPage() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <History className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-ink">이용 내역</h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          지난 예약과 견적 내역이 이곳에 표시됩니다. 현재는 준비 중인
          화면입니다.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
