import { cn } from "@/lib/utils";

export type ScheduleStatus = "in-chair" | "arriving" | "upcoming";

const statusStyles: Record<ScheduleStatus, string> = {
  "in-chair": "bg-[#af8d11]/20 text-[#e9c349]",
  arriving: "bg-primary-500/30 text-mint-glow",
  upcoming: "bg-charcoal-700 text-charcoal-100",
};

const statusLabels: Record<ScheduleStatus, string> = {
  "in-chair": "In Chair",
  arriving: "Arriving",
  upcoming: "Upcoming",
};

export interface ScheduleBadgeProps {
  status: ScheduleStatus;
  className?: string;
}

/**
 * Appointment-stage tag for the Stylist Dashboard schedule. Tighter type scale
 * than `StatusBadge` (10px / 700 / negative tracking / 2px radius) to match the
 * "Stylist Mobile Dashboard" Figma; `StatusBadge` stays for the admin view.
 */
export function ScheduleBadge({ status, className }: ScheduleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[2px] px-2 py-0.5 text-[10px] font-bold tracking-[-0.05em] uppercase",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
