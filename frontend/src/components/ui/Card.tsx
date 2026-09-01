import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardShellProps {
  className?: string;
  children: ReactNode;
}

/**
 * Shared surface for dashboard panels and cards — the "Midnight Luxe" Level 1
 * elevation: subtle top-to-bottom charcoal gradient, hairline emerald border,
 * 12px radius (DESIGN.md § Elevation & Depth / Cards).
 */
export function CardShell({ className, children }: CardShellProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-primary-500/15 bg-linear-to-b from-charcoal-900 to-charcoal-950 p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
