"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarPlus,
  HardDrive,
  MessageSquare,
  Mic,
  Timer,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { KpiCard } from "@/lib/analytics/dashboard";

const ICONS: Record<string, LucideIcon> = {
  totalBooks: BookOpen,
  booksThisMonth: CalendarPlus,
  voiceSessions: Mic,
  storage: HardDrive,
  aiConversations: MessageSquare,
  avgDuration: Timer,
};

function formatValue(value: number, format: KpiCard["format"]) {
  switch (format) {
    case "bytes":
      if (value < 1024) return `${value} B`;
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
      return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    case "duration": {
      const m = Math.floor(value / 60);
      const s = Math.round(value % 60);
      return m > 0 ? `${m}m ${s}s` : `${s}s`;
    }
    case "percent":
      return `${value}%`;
    default:
      return new Intl.NumberFormat().format(Math.round(value));
  }
}

function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: KpiCard["format"];
}) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => formatValue(v, format));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function DashboardKpiCards({ kpis }: { kpis: KpiCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi) => {
        const Icon = ICONS[kpi.key] ?? BookOpen;

        return (
          <Tooltip key={kpi.key}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[var(--border-subtle)] bg-card p-5 text-card-foreground shadow-none"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--landing-maroon-soft)] text-[var(--landing-maroon)]">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  {kpi.label}
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold text-[var(--text-primary)]">
                  <AnimatedNumber value={kpi.value} format={kpi.format} />
                </p>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>{kpi.hint}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
