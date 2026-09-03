import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Header({ sticky = false }: { sticky?: boolean }) {
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
    <header
      className={cn(
        "flex h-16 items-center gap-3 border-b border-charcoal-800 bg-surface-container-low px-4 sm:gap-4 sm:px-6",
        sticky && "sticky top-0 z-30",
      )}
    >
      <div className="relative max-w-xl flex-1">
        <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-charcoal-400" />
        <input
          type="search"
          placeholder="Search clients, stylists, or orders..."
          aria-label="Search clients, stylists, or orders"
          className="focus-ring h-11 w-full rounded-lg border border-charcoal-800 bg-charcoal-950/60 pr-4 pl-11 text-sm text-charcoal-50 placeholder:text-charcoal-400"
        />
      </div>

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
          <ChevronDownIcon size={16} className="hidden text-charcoal-400 sm:block" />
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
    </header>
  );
}
