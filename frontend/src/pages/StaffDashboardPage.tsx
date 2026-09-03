import { useEffect, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { ScheduleBadge, type ScheduleStatus } from "@/components/ui/ScheduleBadge";
import {
  BellIcon,
  CalendarAvailableIcon,
  CalendarFilledIcon,
  ChevronDownIcon,
  StarIcon,
  StickyNoteIcon,
  UserFilledIcon,
  UsersFilledIcon,
  WalletCardsIcon,
} from "@/components/ui/icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type QuickStat = { label: string; value: string; icon: IconType; tone: string };

const quickStats: QuickStat[] = [
  { label: "Today's Rev", value: "$450", icon: WalletCardsIcon, tone: "text-[#e9c349]" },
  { label: "Open Slots", value: "3", icon: CalendarAvailableIcon, tone: "text-mint-glow" },
  { label: "Avg Rating", value: "4.9", icon: StarIcon, tone: "text-[#e9c349]" },
];

type ScheduleSlot = {
  time: string;
  meridiem: string;
  client: string;
  service: string;
  status: ScheduleStatus;
  active?: boolean;
};

const schedule: ScheduleSlot[] = [
  {
    time: "10:00",
    meridiem: "AM",
    client: "Eleanor Rigby",
    service: "Balayage Refresh",
    status: "in-chair",
    active: true,
  },
  {
    time: "12:30",
    meridiem: "PM",
    client: "Marcus Thorne",
    service: "Signature Cut",
    status: "arriving",
  },
  {
    time: "03:00",
    meridiem: "PM",
    client: "Sienna Brooks",
    service: "Silk Press",
    status: "upcoming",
  },
];

const recentNote = {
  client: "Eleanor Rigby",
  label: "Color Formula - Last Visit",
  formula: [
    "Root: 6N + 7NA (1:1) w/ 10vol",
    "Mids/Ends: Gloss 9V + 9P + Clear",
    "Processing: 25 mins",
  ].join("\n"),
};

const navLinks: { label: string; icon: IconType; active?: boolean }[] = [
  { label: "Schedule", icon: CalendarFilledIcon, active: true },
  { label: "Clients", icon: UsersFilledIcon },
  { label: "Profile", icon: UserFilledIcon },
];

export function StaffDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Stylist";

  return (
    <div className="flex min-h-screen flex-col bg-charcoal-950 text-charcoal-50">
      <StaffTopBar />

      <main className="flex-1 pb-24 md:pb-12">
        <div className="section-container space-y-10 py-8 sm:space-y-12 sm:py-10">
          <section className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-[#e9c349] uppercase">
              Welcome Back
            </p>
            <h1 className="font-display text-3xl text-charcoal-50 sm:text-4xl">
              {firstName}
            </h1>
          </section>

          <section>
            <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0">
              {quickStats.map((stat) => (
                <QuickStatCard key={stat.label} {...stat} />
              ))}
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="space-y-6 lg:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-normal text-charcoal-50">
                  Today's Schedule
                </h2>
                <button
                  type="button"
                  className="focus-ring shrink-0 rounded-sm text-xs font-medium tracking-wider text-mint-glow transition-colors hover:text-mint-glow/80"
                >
                  View Calendar
                </button>
              </div>
              <div className="space-y-4">
                {schedule.map((slot) => (
                  <ScheduleSlotRow key={slot.client} {...slot} />
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <h2 className="font-display text-2xl font-normal text-charcoal-50">
                Recent Notes
              </h2>
              <article className="overflow-hidden rounded-lg border border-primary-500/20 bg-charcoal-900/60 backdrop-blur-md">
                <div className="flex items-center gap-3 border-b border-primary-500/10 bg-primary-500/5 p-5">
                  <StickyNoteIcon className="h-3 w-3 shrink-0 text-[#e9c349]" />
                  <span className="text-sm font-semibold tracking-widest text-charcoal-50">
                    {recentNote.client}
                  </span>
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs font-medium tracking-wider text-charcoal-100 uppercase">
                    {recentNote.label}
                  </p>
                  <pre className="scrollbar-hide overflow-x-auto rounded border border-primary-500/10 bg-[#151d1b] p-4 font-mono text-[13px] leading-[1.6] text-[#b8cac4]">
                    {recentNote.formula}
                  </pre>
                </div>
              </article>
            </aside>
          </div>
        </div>
      </main>

      <StaffBottomNav />
    </div>
  );
}

function StaffTopBar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-primary-500/20 bg-charcoal-950/80 shadow-[0_1px_2px_0_rgb(161_209_191/0.15)] backdrop-blur-md">
      <div className="section-container flex h-16 items-center gap-4 lg:h-20">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-mint-glow/30">
            <span className="font-display text-lg leading-none text-mint-glow">DO</span>
          </span>
          <span className="truncate font-display text-lg tracking-[0.3em] text-mint-glow sm:text-xl">
            DADDYOM
          </span>
        </div>

        <nav aria-label="Primary" className="ml-8 hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {navLinks.map(({ label, active }) => (
              <li key={label}>
                <a
                  href="#"
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring rounded-sm text-xs font-semibold tracking-widest uppercase transition-colors",
                    active
                      ? "text-gold-400"
                      : "text-charcoal-300 hover:text-charcoal-50",
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="focus-ring shrink-0 rounded-md p-1 text-mint-glow transition-colors hover:text-mint-glow/80"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              className="focus-ring flex items-center gap-2 rounded-full"
            >
              <Avatar name={user?.name ?? "Guest"} size="sm" />
              <ChevronDownIcon className="hidden h-4 w-4 text-charcoal-400 sm:block" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-charcoal-800 bg-charcoal-900 py-1 shadow-gold-glow"
              >
                {user && (
                  <div className="border-b border-charcoal-800 px-3 py-2">
                    <p className="truncate text-sm text-charcoal-50">{user.name}</p>
                    <p className="truncate text-xs text-charcoal-400">{user.email}</p>
                  </div>
                )}
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="focus-ring block w-full px-3 py-2 text-left text-sm text-charcoal-200 hover:bg-charcoal-800"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function QuickStatCard({ label, value, icon: Icon, tone }: QuickStat) {
  return (
    <div className="flex min-w-40 shrink-0 snap-start flex-col rounded-lg border border-primary-500/20 bg-charcoal-900/60 p-5 backdrop-blur-md sm:min-w-0 sm:p-6">
      <Icon className={cn("h-5 w-5", tone)} />
      <p className="mt-4 text-xs font-medium tracking-wider text-charcoal-100 uppercase">
        {label}
      </p>
      <p className="mt-1 font-display text-[2rem] leading-[1.3] font-medium text-charcoal-50">
        {value}
      </p>
    </div>
  );
}

function ScheduleSlotRow({
  time,
  meridiem,
  client,
  service,
  status,
  active,
}: ScheduleSlot) {
  return (
    <article
      className={cn(
        "flex items-center gap-6 rounded-lg border border-primary-500/20 p-5 sm:gap-8",
        active
          ? "bg-linear-to-b from-charcoal-900 to-charcoal-950"
          : "bg-charcoal-900/60 backdrop-blur-md",
      )}
    >
      <div className="flex w-[70px] shrink-0 flex-col items-end">
        <span className="font-sans text-sm font-semibold tracking-widest text-charcoal-50">
          {time}
        </span>
        <span className="text-[10px] font-normal text-charcoal-100 uppercase">
          {meridiem}
        </span>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-3">
          <h3
            className={cn(
              "truncate font-display text-lg font-normal",
              active ? "text-mint-glow" : "text-charcoal-50",
            )}
          >
            {client}
          </h3>
          <ScheduleBadge status={status} />
        </div>
        <p className="truncate text-xs font-medium tracking-wider text-charcoal-100">
          {service}
        </p>
      </div>
    </article>
  );
}

function StaffBottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-xl border-t border-primary-500/10 bg-[#151d1b]/90 shadow-[0_4px_6px_0_rgb(161_209_191/0.1),0_10px_15px_0_rgb(161_209_191/0.1)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-6 py-3">
        {navLinks.map(({ label, icon: Icon, active }) => (
          <li key={label}>
            <a
              href="#"
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-ring flex flex-col items-center gap-1 rounded-xl px-4 py-1 text-xs font-medium tracking-wider uppercase transition-colors",
                active
                  ? "bg-[#af8d11]/20 text-[#e9c349]"
                  : "text-charcoal-100 hover:text-charcoal-50",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
