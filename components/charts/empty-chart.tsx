"use client";

import { BarChart3 } from "lucide-react";

export function EmptyChart({
  message = "No data yet",
  hint = "Upload a book or start a voice session to see analytics.",
}: {
  message?: string;
  hint?: string;
}) {
  return (
    <div className="flex h-[280px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 px-6 text-center">
      <BarChart3 className="size-8 text-[var(--text-muted)] opacity-60" />
      <p className="font-medium text-[var(--text-primary)]">{message}</p>
      <p className="text-sm text-[var(--text-secondary)]">{hint}</p>
    </div>
  );
}
