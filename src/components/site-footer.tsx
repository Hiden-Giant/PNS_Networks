const FOOTER_LINKS = ["개인정보 처리방침", "이용약관", "컴플라이언스", "고객 지원"];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ocean/40">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-6 py-12 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="max-w-md">
          <p className="eyebrow mb-3">PNS Networks Enterprise</p>
          <p className="text-sm leading-6 text-ink-soft">전문적이고 안정적이며 투명한 포워딩 서비스를 위한 글로벌 물류 인프라 파트너입니다.</p>
          <p className="mt-4 text-xs text-muted">© PNS Networks Enterprise. All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="하단 메뉴">
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#" className="text-sm text-ink-soft transition-colors hover:text-brand">{link}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
