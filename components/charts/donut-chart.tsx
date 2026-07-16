"use client";

import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
} from "recharts";

import { ChartTooltip } from "@/components/charts/tooltip";
import { ChartLegend } from "@/components/charts/legend";
import { EmptyChart } from "@/components/charts/empty-chart";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";
import { chartSliceColor } from "@/lib/chart-colors";

type Slice = { name: string; value: number };

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function DonutChart({
  data,
  loading,
  centerLabel,
  valueFormat = "number",
  emptyMessage = "No data yet",
}: {
  data: Slice[];
  loading?: boolean;
  centerLabel?: string;
  valueFormat?: "bytes" | "number";
  emptyMessage?: string;
}) {
  if (loading) return <ChartSkeleton />;
  if (!data.length || data.every((d) => d.value === 0)) {
    return <EmptyChart message={emptyMessage} />;
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const centerValue =
    valueFormat === "bytes" ? formatBytes(total) : String(total);

  return (
    <div className="relative h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            isAnimationActive
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={chartSliceColor(i)}
                stroke="var(--card)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <ChartTooltip />
          <ChartLegend />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6">
        <span className="text-xs text-[var(--text-secondary)]">
          {centerLabel ?? "Total"}
        </span>
        <span className="font-serif text-lg font-semibold text-[var(--text-primary)]">
          {centerValue}
        </span>
      </div>
    </div>
  );
}
