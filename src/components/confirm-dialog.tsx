"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "./icons";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancelRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    cancelButtonRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" aria-label="확인창 닫기" onClick={onCancel} className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" />
      <section role="alertdialog" aria-modal="true" aria-label={title} className="relative w-full max-w-md rounded-card bg-white p-6 shadow-2xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand"><AlertTriangle className="h-6 w-6" /></span>
        <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button ref={cancelButtonRef} type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-canvas">취소</button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
