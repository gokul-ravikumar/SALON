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
    <aside className="hidden w-64 shrink-0 border-r border-charcoal-200 bg-white lg:flex lg:flex-col dark:border-charcoal-800 dark:bg-charcoal-900">
      <div className="flex h-16 items-center border-b border-charcoal-200 px-6 dark:border-charcoal-800">
        <span className="font-display text-xl text-primary-600 dark:text-primary-400">
          Bloom &amp; Co.
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={
              item.active
                ? "focus-ring block rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "focus-ring block rounded-lg px-3 py-2 text-sm font-medium text-charcoal-600 hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:bg-charcoal-800"
            }
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
