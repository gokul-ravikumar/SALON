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
        "rounded-2xl border border-charcoal-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-charcoal-700 dark:bg-charcoal-900",
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
        <h3 className="font-display text-lg text-charcoal-900 dark:text-charcoal-50">
          {name}
        </h3>
        <span className="shrink-0 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-700 dark:bg-gold-900/40 dark:text-gold-300">
          {durationMinutes} min
        </span>
      </div>
      <p className="mt-2 text-sm text-charcoal-600 dark:text-charcoal-300">
        {description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-xl text-primary-600 dark:text-primary-400">
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
  confirmed:
    "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  pending:
    "bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-300",
  cancelled:
    "bg-charcoal-200 text-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-300",
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
        <p className="font-medium text-charcoal-900 dark:text-charcoal-50">
          {clientName}
        </p>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
          {service} · {time}
        </p>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
          statusStyles[status],
        )}
      >
        {status}
      </span>
    </CardShell>
  );
}
