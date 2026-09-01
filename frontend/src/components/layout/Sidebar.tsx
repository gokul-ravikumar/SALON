import type { ComponentType, SVGProps } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  LayoutGridIcon,
  ScissorsIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "@/components/ui/icons";

type NavItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGridIcon, active: true },
  { label: "Appointments", icon: CalendarIcon },
  { label: "Services", icon: ScissorsIcon },
  { label: "Clients", icon: UserIcon },
  { label: "Staff", icon: UsersIcon },
  { label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-charcoal-800 bg-charcoal-900 lg:flex">
      <div className="flex flex-col items-center gap-3 border-b border-charcoal-800 px-6 py-8">
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-charcoal-50">
          <span className="font-display text-xl leading-none text-gold-600">DO</span>
          <span className="mt-0.5 text-[0.5rem] tracking-[0.14em] text-charcoal-600 uppercase">
            DaddyOm
          </span>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl text-gold-400">DaddyOm</p>
          <p className="mt-1 text-[0.65rem] tracking-[0.2em] text-charcoal-300 uppercase">
            Luxury Hair Studio
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-900/30 text-gold-300"
                : "text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100",
            )}
          >
            {active && (
              <span className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-r bg-gold-400" />
            )}
            <Icon className="h-5 w-5" />
            {label}
          </a>
        ))}
      </nav>

      <div className="p-4">
        <Button variant="primary" size="lg" className="w-full">
          New Booking
        </Button>
      </div>
    </aside>
  );
}
