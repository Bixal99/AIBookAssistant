"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/charts/tooltip";
import { EmptyChart } from "@/components/charts/empty-chart";
import { ChartSkeleton } from "@/components/charts/chart-skeleton";

type Point = { date?: string; name?: string; value: number };

export function BarChart({
  data,
  loading,
  horizontal = false,
  color = "var(--landing-maroon)",
  nameKey = "date",
}: {
  data: Point[];
  loading?: boolean;
  horizontal?: boolean;
  color?: string;
  nameKey?: "date" | "name";
}) {
  if (loading) return <ChartSkeleton />;
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <EmptyChart />;

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 8, left: horizontal ? 8 : 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          {horizontal ? (
            <>
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              />
              <YAxis
                type="category"
                dataKey={nameKey}
                width={100}
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={nameKey}
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                tickFormatter={(v) =>
                  nameKey === "date" ? String(v).slice(5) : String(v)
                }
                minTickGap={16}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                width={32}
              />
            </>
          )}
          <ChartTooltip />
          <Bar
            dataKey="value"
            name="Count"
            fill={color}
            radius={[6, 6, 0, 0]}
            isAnimationActive
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
