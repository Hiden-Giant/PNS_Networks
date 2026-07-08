"use client";

import { useEffect } from "react";
import { Box, Close } from "./icons";
import { SidebarNav } from "./sidebar-nav";

export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="메뉴 닫기"
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-[min(20rem,88vw)] flex-col border-r border-nav-line bg-nav text-white shadow-2xl">
        <div className="flex h-14 items-center justify-between border-b border-nav-line px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <Box className="h-5 w-5" />
            </span>
            <span className="text-base font-black tracking-tight">
              PNS <span className="font-medium text-white/80">Networks</span>
            </span>
          </div>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Close className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav onNavigate={onClose} />
      </aside>
    </div>
  );
}
