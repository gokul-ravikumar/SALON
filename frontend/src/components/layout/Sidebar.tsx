const navItems = [
  { label: "Dashboard", href: "#", active: true },
  { label: "Appointments", href: "#" },
  { label: "Services", href: "#" },
  { label: "Clients", href: "#" },
  { label: "Staff", href: "#" },
  { label: "Settings", href: "#" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-charcoal-800 bg-charcoal-900 lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-charcoal-800 px-6">
        <span className="font-display text-xl text-primary-400">
          DaddyOm
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={
              item.active
                ? "focus-ring block rounded-md bg-primary-900/30 px-3 py-2 text-sm font-medium text-primary-300"
                : "focus-ring block rounded-md px-3 py-2 text-sm font-medium text-charcoal-300 hover:bg-charcoal-800"
            }
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
