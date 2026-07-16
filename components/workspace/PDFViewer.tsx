"use client";

import dynamic from "next/dynamic";

const PDFViewerClient = dynamic(
  () => import("@/components/workspace/PDFViewerClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[32rem] items-center justify-center rounded-3xl border border-[var(--border-subtle)] bg-card text-sm text-[var(--text-secondary)] shadow-sm">
        Loading PDF viewer...
      </div>
    ),
  },
);

export default PDFViewerClient;
