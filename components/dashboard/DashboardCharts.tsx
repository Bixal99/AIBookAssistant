"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ChartCard } from "@/components/charts/chart-card";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import { loadDashboardCharts } from "@/lib/actions/dashboard.actions";
import type {
  ChartRange,
  DashboardAnalytics,
  TimePoint,
} from "@/lib/analytics/dashboard";
import { cn } from "@/lib/utils";

const LineChart = dynamic(
  () =>
    import("@/components/charts/line-chart").then((m) => m.LineChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const AreaChart = dynamic(
  () =>
    import("@/components/charts/area-chart").then((m) => m.AreaChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const BarChart = dynamic(
  () => import("@/components/charts/bar-chart").then((m) => m.BarChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const PieChart = dynamic(
  () => import("@/components/charts/pie-chart").then((m) => m.PieChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const DonutChart = dynamic(
  () =>
    import("@/components/charts/donut-chart").then((m) => m.DonutChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const RANGES: { id: ChartRange; label: string }[] = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "year", label: "Year" },
];

function RangeTabs({
  value,
  loading,
  onChange,
  label,
}: {
  value: ChartRange;
  loading: boolean;
  onChange: (next: ChartRange) => void;
  label: string;
}) {
  return (
    <div
      className="flex w-full flex-nowrap gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={label}
    >
      {RANGES.map((r) => {
        const active = value === r.id;
        return (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={loading}
            onClick={() => onChange(r.id)}
            style={{ whiteSpace: "nowrap" }}
            className={cn(
              "inline-flex h-8 shrink-0 grow-0 basis-auto items-center justify-center rounded-full px-3 text-xs font-medium transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              active
                ? "!bg-[var(--landing-maroon)] !text-white hover:!bg-[var(--landing-maroon-hover)] hover:!text-white"
                : "!bg-[var(--landing-parchment-deep)] !text-[var(--landing-maroon)] hover:!bg-[var(--landing-maroon-soft)] hover:!text-[var(--landing-maroon)] dark:!bg-[var(--bg-tertiary)] dark:!text-[#f5efe6] dark:hover:!bg-[var(--landing-maroon-soft)] dark:hover:!text-white",
            )}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

function ChartSwap({
  swapKey,
  loading,
  children,
}: {
  swapKey: string;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={swapKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={cn(loading && "pointer-events-none opacity-55")}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function DashboardCharts({
  data: initialData,
  range: initialRange = "30d",
}: {
  data: DashboardAnalytics;
  range?: ChartRange;
}) {
  const [uploadRange, setUploadRange] = useState<ChartRange>(initialRange);
  const [voiceRange, setVoiceRange] = useState<ChartRange>(initialRange);
  const [uploadActivity, setUploadActivity] = useState<TimePoint[]>(
    initialData.uploadActivity,
  );
  const [voiceUsage, setVoiceUsage] = useState<TimePoint[]>(
    initialData.voiceUsage,
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);

  const changeUploadRange = async (next: ChartRange) => {
    if (next === uploadRange || uploadLoading) return;
    const previous = uploadRange;
    setUploadRange(next);
    setUploadLoading(true);
    try {
      const result = await loadDashboardCharts(next);
      if (result.success) {
        setUploadActivity(result.data.uploadActivity);
      } else {
        setUploadRange(previous);
      }
    } catch {
      setUploadRange(previous);
    } finally {
      setUploadLoading(false);
    }
  };

  const changeVoiceRange = async (next: ChartRange) => {
    if (next === voiceRange || voiceLoading) return;
    const previous = voiceRange;
    setVoiceRange(next);
    setVoiceLoading(true);
    try {
      const result = await loadDashboardCharts(next);
      if (result.success) {
        setVoiceUsage(result.data.voiceUsage);
      } else {
        setVoiceRange(previous);
      }
    } catch {
      setVoiceRange(previous);
    } finally {
      setVoiceLoading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Upload Activity"
        description="Books uploaded per day"
        action={
          <RangeTabs
            value={uploadRange}
            loading={uploadLoading}
            onChange={(r) => void changeUploadRange(r)}
            label="Upload activity range"
          />
        }
        className="lg:col-span-2"
      >
        <ChartSwap swapKey={uploadRange} loading={uploadLoading}>
          <LineChart data={uploadActivity} />
        </ChartSwap>
      </ChartCard>

      <ChartCard title="Upload Categories" description="Books by category">
        <PieChart data={initialData.uploadCategories} />
      </ChartCard>

      <ChartCard
        title="Voice Usage"
        description="Session duration over time (seconds)"
        action={
          <RangeTabs
            value={voiceRange}
            loading={voiceLoading}
            onChange={(r) => void changeVoiceRange(r)}
            label="Voice usage range"
          />
        }
      >
        <ChartSwap swapKey={voiceRange} loading={voiceLoading}>
          <AreaChart data={voiceUsage} />
        </ChartSwap>
      </ChartCard>

      <ChartCard title="Top Authors" description="Most uploaded authors">
        <BarChart
          data={initialData.topAuthors}
          horizontal
          nameKey="name"
        />
      </ChartCard>

      <ChartCard
        title="Library Engagement"
        description="Books with voice sessions vs not started"
      >
        <DonutChart
          data={initialData.libraryEngagement}
          centerLabel="Books"
          valueFormat="number"
          emptyMessage="Upload a book to see engagement"
        />
      </ChartCard>

      <ChartCard
        title="Monthly Uploads"
        description="Books uploaded each month"
        className="lg:col-span-2"
      >
        <BarChart data={initialData.monthlyUploads} nameKey="date" />
      </ChartCard>
    </div>
  );
}
