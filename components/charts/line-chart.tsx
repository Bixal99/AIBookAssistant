"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/charts/tooltip";
import { EmptyChart } from "@/components/charts/empty-chart";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";

type Point = { date: string; value: number };

export function LineChart({
  data,
  loading,
  color = "var(--landing-maroon)",
}: {
  data: Point[];
  loading?: boolean;
  color?: string;
}) {
  if (loading) return <ChartSkeleton />;
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <EmptyChart message="No uploads in this period" />;

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            tickFormatter={(v) => String(v).slice(5)}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            width={32}
          />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="value"
            name="Uploads"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
