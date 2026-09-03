import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  type IconComponent,
  CalendarIcon,
  LayoutGridIcon,
  ScissorsIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "@/components/ui/icons";

type NavItem = {
  label: string;
  icon: IconComponent;
  /** Real route target. Items without a `to` are not wired up yet. */
  to?: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGridIcon, to: "/" },
  { label: "Appointments", icon: CalendarIcon },
  { label: "Services", icon: ScissorsIcon, to: "/services" },
  { label: "Clients", icon: UserIcon },
  { label: "Staff", icon: UsersIcon },
  { label: "Settings", icon: SettingsIcon },
];

const linkBase =
  "focus-ring relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors";
const linkActive = "bg-primary-900/30 text-gold-300";
const linkIdle =
  "text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100";

function ActiveIndicator() {
  return (
    <span className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-r bg-gold-400" />
  );
}

export function Sidebar({ sticky = false }: { sticky?: boolean }) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 flex-col border-r border-charcoal-800 bg-surface-container-low lg:flex",
        sticky && "lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto scrollbar-luxe",
      )}
    >
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
        {navItems.map(({ label, icon: Icon, to }) =>
          to ? (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(linkBase, isActive ? linkActive : linkIdle)
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <ActiveIndicator />}
                  <Icon size={20} />
                  {label}
                </>
              )}
            </NavLink>
          ) : (
            <a key={label} href="#" className={cn(linkBase, linkIdle)}>
              <Icon size={20} />
              {label}
            </a>
          ),
        )}
      </nav>

      <div className="p-4">
        <Button variant="primary" size="lg" className="w-full">
          New Booking
        </Button>
      </div>
    </aside>
  );
}
