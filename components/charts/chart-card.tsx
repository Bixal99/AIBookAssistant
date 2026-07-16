"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChartCardProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function ChartCard({
  title,
  description,
  action,
  className,
  children,
}: ChartCardProps) {
  return (
    <Card
      className={cn(
        "border-[var(--border-subtle)] bg-card text-card-foreground shadow-none",
        className,
      )}
    >
      {/* Avoid CardHeader grid/action layout — title and tabs must never sit side-by-side */}
      <div className="flex flex-col gap-3 px-6 pb-2">
        <div className="min-w-0">
          <CardTitle className="font-serif text-lg">{title}</CardTitle>
          {description ? (
            <CardDescription className="mt-1">{description}</CardDescription>
          ) : null}
        </div>
        {action ? <div className="w-full">{action}</div> : null}
      </div>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}
