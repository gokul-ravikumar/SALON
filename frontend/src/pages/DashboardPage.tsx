import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { CardShell } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge, type AppointmentStatus } from "@/components/ui/StatusBadge";
import {
  AlertTriangleIcon,
  CalendarCheckIcon,
  MoreHorizontalIcon,
  TrendingUpIcon,
  WalletIcon,
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";

type Appointment = {
  clientName: string;
  service: string;
  stylist: string;
  time: string;
  status: AppointmentStatus;
};

const appointments: Appointment[] = [
  {
    clientName: "Eleanor Vance",
    service: "Balayage & Trim",
    stylist: "Julian M.",
    time: "10:30 AM",
    status: "confirmed",
  },
  {
    clientName: "Marcus Thorne",
    service: "Conditioning & Cut",
    stylist: "Sophia L.",
    time: "11:15 AM",
    status: "in-progress",
  },
  {
    clientName: "Sienna Brooks",
    service: "Silk Press",
    stylist: "Julian M.",
    time: "01:00 PM",
    status: "arriving",
  },
];

const topStylists = [
  { rank: 1, name: "Julian M.", role: "Master Colorist", revenue: "$12.4k" },
  { rank: 2, name: "Sophia L.", role: "Texture Specialist", revenue: "$10.1k" },
  { rank: 3, name: "David K.", role: "Senior Stylist", revenue: "$9.8k" },
];

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function ordinal(day: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = day % 100;
  return day + (suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0]);
}

function formatToday(date: Date) {
  return `${date.toLocaleDateString("en-US", { month: "long" })} ${ordinal(date.getDate())}`;
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";
  const now = new Date();

  return (
    <DashboardLayout>
      <section>
        <h1 className="font-display text-3xl text-charcoal-50 sm:text-4xl">
          {greetingFor(now)}, <span className="text-gold-400">{firstName}.</span>
        </h1>
        <p className="mt-2 text-sm text-charcoal-300 sm:text-base">
          Your studio performance snapshot for today, {formatToday(now)}.
        </p>
      </section>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Revenue (Today)"
          iconTone="primary"
          icon={<WalletIcon className="h-6 w-6" />}
          value={<span className="text-gold-400">$4,850.00</span>}
          topRight={
            <span className="inline-flex items-center gap-1 rounded-sm bg-gold-900/40 px-2 py-1 text-xs font-semibold text-gold-300">
              <TrendingUpIcon className="h-3.5 w-3.5" />
              +12%
            </span>
          }
        />

        <StatCard
          label="Today's Appointments"
          iconTone="gold"
          icon={<CalendarCheckIcon className="h-6 w-6" />}
          topRight={
            <span className="text-xs font-semibold tracking-widest text-charcoal-300 uppercase">
              77% Full
            </span>
          }
          value={
            <>
              <span className="text-gold-400">14</span>
              <span className="text-charcoal-400"> / 18</span>
            </>
          }
        >
          <ProgressBar value={77} label="Appointments booked today" />
        </StatCard>

        <StatCard
          label="Low Stock Alerts"
          iconTone="error"
          icon={<AlertTriangleIcon className="h-6 w-6" />}
          topRight={
            <button
              type="button"
              className="focus-ring text-xs font-semibold tracking-widest text-gold-400 uppercase hover:text-gold-300"
            >
              Order Now
            </button>
          }
          value={
            <>
              <span className="text-gold-400">03</span>
              <span className="ml-2 font-sans text-base text-charcoal-300">Items</span>
            </>
          }
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-charcoal-50">
              Upcoming Appointments
            </h2>
            <button
              type="button"
              className="focus-ring text-sm font-medium text-gold-400 hover:text-gold-300"
            >
              View Calendar
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {appointments.map((appointment) => (
              <AppointmentRow key={appointment.clientName} {...appointment} />
            ))}
          </div>
        </section>

        <aside>
          <CardShell className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-charcoal-50">Top Stylists</h2>
              <button
                type="button"
                aria-label="Top stylists options"
                className="focus-ring rounded-md p-1 text-charcoal-400 hover:text-charcoal-200"
              >
                <MoreHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-4 space-y-4">
              {topStylists.map((stylist) => (
                <StylistRow key={stylist.name} {...stylist} />
              ))}
            </ul>
            <Button variant="outline" className="mt-5 w-full">
              Performance Reports
            </Button>
          </CardShell>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function AppointmentRow({ clientName, service, stylist, time, status }: Appointment) {
  return (
    <CardShell className="flex flex-wrap items-center gap-4 p-4">
      <Avatar name={clientName} size="md" />
      <div className="min-w-36 flex-1">
        <p className="font-display text-lg text-charcoal-50">{clientName}</p>
        <p className="text-sm text-charcoal-400">{service}</p>
      </div>
      <div className="hidden sm:block">
        <p className="text-[0.65rem] font-medium tracking-widest text-charcoal-400 uppercase">
          Stylist
        </p>
        <p className="text-sm text-gold-400">{stylist}</p>
      </div>
      <p className="font-display text-base text-charcoal-50">{time}</p>
      <StatusBadge status={status} />
    </CardShell>
  );
}

type StylistRowProps = (typeof topStylists)[number];

function StylistRow({ rank, name, role, revenue }: StylistRowProps) {
  return (
    <li className="flex items-center gap-3">
      <div className="relative">
        <Avatar name={name} size="sm" />
        <span className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full border border-charcoal-900 bg-gold-400 text-[0.6rem] font-bold text-charcoal-950">
          {rank}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-charcoal-50">{name}</p>
        <p className="truncate text-xs text-charcoal-400">{role}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gold-400">{revenue}</p>
        <p className="text-[0.6rem] tracking-widest text-charcoal-400 uppercase">MTH</p>
      </div>
    </li>
  );
}
