"use client";

import { Legend } from "recharts";

export function ChartLegend() {
  return (
    <Legend
      verticalAlign="bottom"
      align="center"
      layout="horizontal"
      iconType="circle"
      iconSize={8}
      formatter={(value) => (
        <span className="text-xs text-[var(--landing-ink)]">{value}</span>
      )}
      wrapperStyle={{
        paddingTop: 12,
        width: "100%",
        lineHeight: "22px",
      }}
    />
  );
}
