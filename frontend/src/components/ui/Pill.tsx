import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  gold: "bg-gold-900/40 text-gold-300",
  muted: "bg-charcoal-800 text-charcoal-300",
} as const;

export interface PillProps {
  children: ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
}

/** Small uppercase label pill — "SIGNATURE" tags, "FROM $350" / role labels. */
export function Pill({ children, tone = "gold", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-[0.7rem] font-semibold tracking-widest uppercase",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
