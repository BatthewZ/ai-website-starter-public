import { LayoutDashboard, type LucideIcon, Settings } from "lucide-react";

import { AUTHENTICATED_HOME } from "@/web/lib/auth/redirect";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * The signed-in destinations, in order. One list feeds the shell's sidebar
 * (wide and medium viewports) and its bottom nav (phones), so a page added
 * here appears in both. Keep it to five or fewer: the bottom nav has room for
 * five.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: AUTHENTICATED_HOME, label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];
