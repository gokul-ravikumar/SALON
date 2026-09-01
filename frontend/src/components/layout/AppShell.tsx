import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

/**
 * Chrome for the customer-facing app: sticky top bar, a scrolling content area,
 * and a fixed bottom tab bar on mobile (its items move into the header at md+).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-charcoal-950">
      <AppHeader />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
