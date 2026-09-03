import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronDownIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { navItems } from "./navItems";

export function AppHeader() {
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

        <div className="relative ml-auto" ref={menuRef}>
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
    </header>
  );
}
