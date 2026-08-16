import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant =
  | "neon"
  | "outline"
  | "vendor"
  | "partner"
  | "soon"
  | "danger"
  | "warning"
  | "info"
  | "muted";

const VARIANTS: Record<Variant, string> = {
  neon: "bg-neon/15 text-neon border border-neon/40",
  outline: "border border-border-strong text-fg-muted",
  vendor: "bg-info/15 text-info border border-info/40",
  partner: "bg-warning/15 text-warning border border-warning/40",
  soon: "bg-fg-subtle/15 text-fg-subtle border border-fg-subtle/30",
  danger: "bg-danger/15 text-danger border border-danger/40",
  warning: "bg-warning/15 text-warning border border-warning/40",
  info: "bg-info/15 text-info border border-info/40",
  muted: "bg-bg-elevated text-fg-muted border border-border",
};

export function Badge({
  children,
  variant = "outline",
  className,
  glow = false,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  glow?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap",
        VARIANTS[variant],
        glow && variant === "neon" && "glow",
        className,
      )}
    >
      {children}
    </span>
  );
}
