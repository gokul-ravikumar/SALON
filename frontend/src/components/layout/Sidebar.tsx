import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  type IconComponent,
  CalendarIcon,
  CloseIcon,
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
  { label: "Staff", icon: UsersIcon, to: "/staff" },
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

interface SidebarProps {
  sticky?: boolean;
  /** Whether the mobile drawer is open. Ignored at `lg:` and up, where the sidebar is always visible. */
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ sticky = false, isOpen = false, onClose }: SidebarProps) {
  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}
      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r border-charcoal-800 bg-surface-container-low transition-transform duration-300 ease-in-out lg:z-auto lg:translate-x-0",
          isOpen && "translate-x-0",
          sticky
            ? "lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto scrollbar-luxe"
            : "lg:static",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="focus-ring absolute top-4 right-4 rounded-md p-1 text-charcoal-300 hover:bg-charcoal-800 hover:text-charcoal-100 lg:hidden"
        >
          <CloseIcon size={20} />
        </button>

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
                onClick={onClose}
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
              <a key={label} href="#" onClick={onClose} className={cn(linkBase, linkIdle)}>
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
    </>
  );
}
