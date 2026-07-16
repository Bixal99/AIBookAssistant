"use client";

import React from "react";
import { voiceCategories, voiceOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { VoiceSelectorProps } from "@/types";

const ALL_VOICES = [
  ...voiceCategories.male.map((id) => ({ id, group: "Male" as const })),
  ...voiceCategories.female.map((id) => ({ id, group: "Female" as const })),
];

const VoiceSelector = ({
  value,
  onChange,
  disabled,
  className,
  compact = false,
}: VoiceSelectorProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(
          "grid gap-3",
          compact
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {ALL_VOICES.map(({ id, group }) => {
          const voice = voiceOptions[id as keyof typeof voiceOptions];
          const isSelected = value === id;
          return (
            <Label
              key={id}
              htmlFor={`voice-${id}`}
              className={cn(
                "relative flex h-full min-h-[112px] cursor-pointer flex-col gap-2 rounded-xl border-2 p-3.5 transition-colors",
                isSelected
                  ? "border-[var(--landing-maroon)] bg-[var(--landing-maroon-soft)] shadow-sm"
                  : "border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[var(--landing-maroon)]/35 hover:bg-[var(--landing-parchment-deep)] dark:bg-[var(--bg-secondary)] dark:hover:bg-[var(--landing-maroon-soft)]",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              <RadioGroupItem
                value={id}
                id={`voice-${id}`}
                className="sr-only"
              />
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected
                        ? "border-[var(--landing-maroon)]"
                        : "border-[var(--border-medium)]",
                    )}
                    aria-hidden
                  >
                    {isSelected ? (
                      <span className="size-2 rounded-full bg-[var(--landing-maroon)]" />
                    ) : null}
                  </span>
                  <span className="font-serif text-base font-semibold text-[var(--landing-ink)]">
                    {voice.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
                    isSelected
                      ? "bg-[var(--landing-maroon)] text-white"
                      : "bg-[var(--landing-parchment-deep)] text-[var(--text-secondary)] dark:bg-[var(--bg-tertiary)]",
                  )}
                >
                  {group}
                </span>
              </div>
              <p className="flex-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                {voice.description}
              </p>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default VoiceSelector;
