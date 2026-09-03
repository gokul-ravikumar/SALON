import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

/**
 * Admin shell that scrolls on the browser window instead of an inner container.
 * The nav rail and header stay pinned via `sticky`; the page owns the scrollbar.
 * `DashboardLayout` keeps the inner-scroll shell for the main dashboard.
 */
export function ServiceDirectoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-charcoal-950">
      <Sidebar sticky />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header sticky />
        <main className="section-container flex-1 py-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
