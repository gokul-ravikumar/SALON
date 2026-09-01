import { cn } from "@/lib/utils";

export type AppointmentStatus = "confirmed" | "in-progress" | "arriving";

const statusStyles: Record<AppointmentStatus, string> = {
  confirmed: "bg-primary-900/40 text-primary-300",
  "in-progress": "bg-gold-900/40 text-gold-300",
  arriving: "bg-charcoal-800 text-charcoal-200",
};

const statusLabels: Record<AppointmentStatus, string> = {
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  arriving: "Arriving",
};

export interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[0.7rem] font-semibold tracking-[0.06em] uppercase",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
