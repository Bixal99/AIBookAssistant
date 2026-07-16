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

export function PieChart({
  data,
  loading,
}: {
  data: Slice[];
  loading?: boolean;
}) {
  if (loading) return <ChartSkeleton />;
  if (!data.length) {
    return (
      <EmptyChart
        message="No categories yet"
        hint="Add an optional category when uploading a book."
      />
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="42%"
            outerRadius={88}
            paddingAngle={2}
            isAnimationActive
          >
            {data.map((_, i) => (
              <Cell key={i} fill={chartSliceColor(i)} stroke="var(--card)" strokeWidth={2} />
            ))}
          </Pie>
          <ChartTooltip />
          <ChartLegend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
