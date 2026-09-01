import { cn } from "@/lib/utils";
import { navItems } from "./navItems";

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-charcoal-800 bg-charcoal-950/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {navItems.map(({ label, icon: Icon, active }) => (
          <li key={label} className="flex-1">
            <a
              href="#"
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-ring flex flex-col items-center gap-1 rounded-md px-2 py-2.5 text-[0.6rem] font-semibold tracking-widest uppercase transition-colors",
                active
                  ? "text-gold-400"
                  : "text-charcoal-400 hover:text-charcoal-100",
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
