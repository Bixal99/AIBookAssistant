"use client";

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`flex h-[280px] w-full items-center justify-center rounded-xl bg-[var(--bg-secondary)]/60 ${className ?? ""}`}
    >
      <div className="h-8 w-8 animate-pulse rounded-full border-2 border-[var(--landing-maroon)] border-t-transparent" />
    </div>
  );
}
