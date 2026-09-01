import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CardShell } from "./Card";

const iconToneClasses = {
  primary: "bg-primary-900/40 text-primary-300",
  gold: "bg-gold-900/30 text-gold-300",
  error: "bg-error/10 text-error",
} as const;

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  iconTone?: keyof typeof iconToneClasses;
  /** Top-right slot — a trend pill, a "% full" figure, an "order now" link. */
  topRight?: ReactNode;
  /** Footer slot under the value — a progress bar, a caption. */
  children?: ReactNode;
  className?: string;
}

/**
 * KPI card used on the dashboard overview row: tinted icon chip + optional
 * top-right slot, an uppercase micro-label, a large Playfair value, and an
 * optional footer slot.
 */
export function StatCard({
  label,
  value,
  icon,
  iconTone = "primary",
  topRight,
  children,
  className,
}: StatCardProps) {
  return (
    <CardShell className={cn("flex flex-col p-6 sm:p-7", className)}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            iconToneClasses[iconTone],
          )}
        >
          {icon}
        </span>
        {topRight}
      </div>
      <p className="mt-6 text-xs font-medium tracking-widest text-charcoal-300 uppercase">
        {label}
      </p>
      <div className="mt-2 font-display text-3xl text-charcoal-50">{value}</div>
      {children && <div className="mt-5">{children}</div>}
    </CardShell>
  );
}
