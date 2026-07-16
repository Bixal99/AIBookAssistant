"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type UploadStepId =
  | "check"
  | "uploadPdf"
  | "create"
  | "done";

export type UploadStep = {
  id: UploadStepId;
  label: string;
};

export const UPLOAD_STEPS: UploadStep[] = [
  { id: "check", label: "Checking library" },
  { id: "uploadPdf", label: "Uploading PDF" },
  { id: "create", label: "Saving book" },
  { id: "done", label: "Opening chat" },
];

type LoadingOverlayProps = {
  progress: number;
  stepId: UploadStepId;
  detail?: string;
};

function stepStatus(
  stepId: UploadStepId,
  currentId: UploadStepId,
): "done" | "active" | "pending" {
  const order = UPLOAD_STEPS.map((s) => s.id);
  const current = order.indexOf(currentId);
  const index = order.indexOf(stepId);
  if (index < current) return "done";
  if (index === current) return "active";
  return "pending";
}

export default function LoadingOverlay({
  progress,
  stepId,
  detail,
}: LoadingOverlayProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const current = UPLOAD_STEPS.find((s) => s.id === stepId);

  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper w-full max-w-md bg-card text-card-foreground shadow-soft-lg">
        <div className="loading-shadow w-full space-y-5">
          <div className="relative mx-auto flex size-14 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="var(--landing-parchment-deep)"
                strokeWidth="4"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="var(--landing-maroon)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 24}
                initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 24 * (1 - pct / 100),
                }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
              />
            </svg>
            <span className="font-serif text-sm font-semibold text-[var(--landing-maroon)]">
              {pct}%
            </span>
          </div>

          <div className="space-y-1 text-center">
            <h2 className="loading-title">Uploading Your Book</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {current?.label ?? "Working…"}
              {detail ? ` — ${detail}` : ""}
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--landing-parchment-deep)]">
              <motion.div
                className="h-full rounded-full bg-[var(--landing-maroon)]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 22 }}
              />
            </div>
          </div>

          <ul className="loading-progress w-full space-y-2.5 text-left">
            {UPLOAD_STEPS.map((step) => {
              const status = stepStatus(step.id, stepId);
              return (
                <li
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2.5 text-sm",
                    status === "pending" && "text-[var(--text-secondary)]/50",
                    status === "active" &&
                      "font-medium text-[var(--landing-maroon)]",
                    status === "done" && "text-[var(--success)]",
                  )}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center">
                    {status === "done" ? (
                      <Check className="size-3.5" strokeWidth={3} />
                    ) : status === "active" ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current opacity-40" />
                    )}
                  </span>
                  {step.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
