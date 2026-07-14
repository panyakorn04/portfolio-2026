import type { ReactNode } from "react";

export default function MotionReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`editorial-reveal ${className}`}>{children}</div>;
}
