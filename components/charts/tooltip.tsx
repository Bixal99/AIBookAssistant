"use client";

import { Tooltip } from "recharts";

export function ChartTooltip() {
  return (
    <Tooltip
      cursor={{ stroke: "var(--border-medium)", strokeDasharray: "4 4" }}
      allowEscapeViewBox={{ x: false, y: false }}
      wrapperStyle={{ outline: "none", zIndex: 20 }}
      contentStyle={{
        borderRadius: 12,
        border: "1px solid var(--border-subtle)",
        background: "var(--card)",
        color: "var(--card-foreground)",
        boxShadow: "var(--shadow-soft)",
      }}
      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
    />
  );
}
