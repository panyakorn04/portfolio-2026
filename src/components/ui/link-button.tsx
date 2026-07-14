import type { AnchorHTMLAttributes, ReactNode } from "react";
import { linkButtonPrimary, linkButtonSecondary } from "./typography";

type LinkButtonVariant = "primary" | "secondary";

type LinkButtonProps = {
  variant?: LinkButtonVariant;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const variants: Record<LinkButtonVariant, string> = {
  primary: linkButtonPrimary,
  secondary: linkButtonSecondary,
};

export default function LinkButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <a className={`${variants[variant]}${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </a>
  );
}
