import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-[var(--border-medium)] bg-card px-3 py-2 text-sm text-[var(--landing-ink)] shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-[var(--text-secondary)]/70",
        "selection:bg-[var(--landing-maroon-soft)] selection:text-[var(--landing-maroon)]",
        "focus-visible:border-[var(--landing-maroon)] focus-visible:ring-[3px] focus-visible:ring-[var(--landing-maroon)]/20",
        "disabled:cursor-not-allowed disabled:bg-[var(--bg-primary)] disabled:opacity-80 dark:disabled:bg-[var(--bg-secondary)]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--landing-ink)]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
