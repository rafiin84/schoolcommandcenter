import {
  AddressBook,
  Gauge,
  Megaphone,
  MapTrifold,
  SignIn,
  SquaresFour,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<IconProps>;
}

// Notifications is intentionally left out — it's already reachable from the
// bell icon in the top bar, so it doesn't need a second entry in this list.
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: "/overview", label: "Overview", icon: Gauge },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/education-map", label: "Education Map", icon: MapTrifold },
  { href: "/alerts", label: "Alerts & Exceptions", icon: Warning },
  { href: "/zoho-access", label: "Zoho Classes Access", icon: SignIn },
  { href: "/course-template", label: "Course Template", icon: SquaresFour },
  { href: "/directory", label: "Directory", icon: AddressBook },
];

// The mobile bottom bar shows these 4, plus a 5th "More" button that opens
// a sheet listing everything in MOBILE_OVERFLOW_NAV_ITEMS.
export const MOBILE_NAV_ITEMS: NavItem[] = PRIMARY_NAV_ITEMS.slice(0, 4);
export const MOBILE_OVERFLOW_NAV_ITEMS: NavItem[] = PRIMARY_NAV_ITEMS.slice(4);

// Route → title lookup for the top bar, covering routes that aren't in the
// sidebar nav (e.g. notifications, alert detail) as well as the ones that are.
const TITLE_ROUTES: { href: string; title: string }[] = [
  ...PRIMARY_NAV_ITEMS.map((item) => ({ href: item.href, title: item.label })),
  { href: "/alerts/", title: "Alert details" },
  { href: "/notifications", title: "Notifications" },
];

export function pageTitleFor(pathname: string): string {
  if (pathname === "/alerts") return "Alerts & Exceptions";
  const match = TITLE_ROUTES.filter((r) => pathname.startsWith(r.href)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0];
  return match?.title ?? "School Command Center";
}
