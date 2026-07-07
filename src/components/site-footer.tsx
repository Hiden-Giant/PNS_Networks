const FOOTER_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Compliance",
  "Contact Support",
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ocean/40">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-6 py-12 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="max-w-md">
          <p className="eyebrow mb-3">PNS Networks Enterprise</p>
          <p className="text-sm leading-6 text-ink-soft">
            Global infrastructure partner for expert, stable, and transparent
            freight forwarding solutions.
          </p>
          <p className="mt-4 text-xs text-muted">
            © 2024 PNS Networks Enterprise. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-ink-soft transition-colors hover:text-brand"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
