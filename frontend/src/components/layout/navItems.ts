import type { ComponentType, SVGProps } from "react";
import {
  BookmarkIcon,
  BookOpenIcon,
  CalendarIcon,
  UserIcon,
} from "@/components/ui/icons";

export type NavItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  active?: boolean;
};

/** Shared by `BottomNav` (mobile) and `AppHeader` (md+). No routes exist yet. */
export const navItems: NavItem[] = [
  { label: "Book", icon: BookmarkIcon, active: true },
  { label: "Appointments", icon: CalendarIcon },
  { label: "Journal", icon: BookOpenIcon },
  { label: "Profile", icon: UserIcon },
];
