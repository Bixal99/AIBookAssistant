"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/charts/tooltip";
import { EmptyChart } from "@/components/charts/empty-chart";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";

type Point = { date: string; value: number };

export function AreaChart({
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
  if (!hasData) return <EmptyChart message="No voice usage yet" />;

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="voiceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            tickFormatter={(v) => String(v).slice(5)}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            width={40}
          />
          <ChartTooltip />
          <Area
            type="monotone"
            dataKey="value"
            name="Duration (sec)"
            stroke={color}
            fill="url(#voiceFill)"
            strokeWidth={2}
            isAnimationActive
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
