import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { navItems } from "./navItems";

export function AppHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-800 bg-charcoal-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <button
          type="button"
          aria-label="Open menu"
          className="focus-ring rounded-md p-1 text-charcoal-200 hover:text-charcoal-50 md:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        <span className="mx-auto font-display text-lg tracking-[0.3em] text-charcoal-50 md:mx-0 md:text-xl">
          DADDYOM
        </span>

        <nav aria-label="Primary" className="ml-8 hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {navItems.map(({ label, active }) => (
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

        <Avatar name={user?.name ?? "Guest"} size="sm" className="ml-auto" />
      </div>
    </header>
  );
}
