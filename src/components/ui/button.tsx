import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-mono uppercase tracking-[0.04em] text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "border border-(--color-line-strong) bg-(--color-accent) text-(--color-accent-foreground) hover:opacity-90",
        secondary:
          "border border-(--color-line-strong) bg-(--surface) text-(--color-text) hover:border-(--color-accent) hover:bg-(--surface-hover) hover:text-(--color-accent)",
        ghost: "border border-(--color-line) text-(--color-text) hover:opacity-80",
        action:
          "border border-(--color-line-strong) bg-(--color-panel) text-(--color-text)",
        chip: "border border-(--color-line) bg-(--surface) text-(--color-text) hover:border-(--color-line-strong) hover:bg-(--surface-hover) hover:text-(--color-accent)",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-(--color-line-strong) bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        lg: "h-10 px-5 py-3 text-[0.7rem] font-semibold tracking-[0.06em] has-[>svg]:px-4",
        md: "h-9 px-4 py-2 text-[0.7rem] has-[>svg]:px-3",
        sm: "h-8 px-3 py-1.5 text-[0.66rem] has-[>svg]:px-2.5",
        xs: "h-7 px-3 py-1 text-[0.66rem] has-[>svg]:px-2",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
