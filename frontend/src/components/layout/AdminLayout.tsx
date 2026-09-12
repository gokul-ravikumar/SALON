import { type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Shared admin/staff shell: `Sidebar` + `Header` around page content, with a
 * mobile drawer for the sidebar below `lg:`. Owns the drawer's open/close
 * state since `Sidebar` and `Header` are siblings that need to coordinate it,
 * and closes the drawer automatically on route change.
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div
      className={cn(
        "flex min-h-screen bg-charcoal-950",
      )}
    >
      <Sidebar
        sticky={true}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <div className={cn("flex min-w-0 flex-1 flex-col")}>
        <Header
          sticky={true}
          isMobileNavOpen={mobileNavOpen}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main
          className={"section-container flex-1 py-8 sm:py-10"}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
