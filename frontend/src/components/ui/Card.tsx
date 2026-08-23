import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface CardShellProps {
  className?: string;
  children: ReactNode;
}

function CardShell({ className, children }: CardShellProps) {
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

export interface ServiceCardProps {
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
  onBook?: () => void;
}

export function ServiceCard({
  name,
  durationMinutes,
  price,
  description,
  onBook,
}: ServiceCardProps) {
  return (
    <CardShell>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-charcoal-50">{name}</h3>
        <span className="shrink-0 rounded-sm bg-gold-900/40 px-2.5 py-0.5 text-xs font-medium text-gold-300">
          {durationMinutes} min
        </span>
      </div>
      <p className="mt-2 text-sm text-charcoal-300">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-xl text-primary-400">
          ${price.toFixed(2)}
        </span>
        <Button size="sm" onClick={onBook}>
          Book now
        </Button>
      </div>
    </CardShell>
  );
}

export type AppointmentStatus = "confirmed" | "pending" | "cancelled";

const statusStyles: Record<AppointmentStatus, string> = {
  confirmed: "bg-primary-900/40 text-primary-300",
  pending: "bg-gold-900/40 text-gold-300",
  cancelled: "bg-charcoal-800 text-charcoal-300",
};

export interface AppointmentCardProps {
  clientName: string;
  service: string;
  time: string;
  status: AppointmentStatus;
}

export function AppointmentCard({
  clientName,
  service,
  time,
  status,
}: AppointmentCardProps) {
  return (
    <CardShell className="flex items-center justify-between p-4">
      <div>
        <p className="font-medium text-charcoal-50">{clientName}</p>
        <p className="text-sm text-charcoal-400">
          {service} · {time}
        </p>
      </div>
      <span
        className={cn(
          "rounded-sm px-2.5 py-0.5 text-xs font-medium capitalize",
          statusStyles[status],
        )}
      >
        {status}
      </span>
    </CardShell>
  );
}
