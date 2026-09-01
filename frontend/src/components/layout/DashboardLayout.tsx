import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-charcoal-950 lg:h-screen lg:overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:h-screen">
        <Header />
        <main className="section-container scrollbar-luxe flex-1 py-8 sm:py-10 lg:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
