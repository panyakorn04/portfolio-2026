import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "action"
  | "chip";

export type ButtonSize = "lg" | "md" | "sm" | "xs";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const buttonBase =
  "inline-flex items-center justify-center rounded-full font-mono uppercase tracking-[0.04em] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-[var(--color-line-strong)] bg-[var(--color-accent)] text-[#041009] hover:opacity-90",
  secondary:
    "border border-[var(--color-line-strong)] bg-[var(--surface)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-accent)]",
  ghost:
    "border border-[var(--color-line)] text-[var(--color-text)] hover:opacity-80",
  action:
    "border border-[var(--color-line-strong)] bg-[var(--color-panel)] text-[var(--color-text)]",
  chip:
    "border border-[var(--color-line)] bg-[var(--surface)] text-[var(--color-text)] hover:border-[var(--color-line-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-accent)]",
};

export const buttonSizes: Record<ButtonSize, string> = {
  lg: "px-5 py-3 text-[0.7rem] font-semibold tracking-[0.06em]",
  md: "px-4 py-2 text-[0.7rem]",
  sm: "px-3 py-1.5 text-[0.66rem]",
  xs: "px-3 py-1 text-[0.66rem]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}${className ? ` ${className}` : ""}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
