"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SubTabs({
  tabs,
}: {
  tabs: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-brand text-white"
                : "text-ink-soft hover:bg-canvas"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
