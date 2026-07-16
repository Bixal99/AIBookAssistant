import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[var(--landing-maroon)]/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--landing-maroon)] !text-white hover:bg-[var(--landing-maroon-hover)] shadow-sm",
        destructive:
          "bg-destructive !text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-[var(--landing-maroon)] bg-[var(--landing-parchment)] text-[var(--landing-maroon)] hover:bg-[var(--landing-parchment-deep)] shadow-xs dark:bg-[var(--bg-card)] dark:hover:bg-[var(--landing-maroon-soft)]",
        secondary:
          "bg-[var(--landing-parchment-deep)] text-[var(--landing-maroon)] hover:bg-[var(--landing-maroon-soft)] dark:bg-[var(--bg-tertiary)] dark:!text-[var(--text-primary)] dark:hover:bg-[var(--landing-maroon-soft)] dark:hover:!text-white",
        ghost:
          "text-[var(--landing-ink)] hover:bg-[var(--landing-parchment-deep)] hover:text-[var(--landing-maroon)] dark:hover:bg-[var(--landing-maroon-soft)]",
        link: "text-[var(--landing-maroon)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
