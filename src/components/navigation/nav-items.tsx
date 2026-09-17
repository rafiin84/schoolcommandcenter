import {
  AddressBook,
  Bell,
  Gauge,
  MapTrifold,
  SignIn,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<IconProps>;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: "/overview", label: "Overview", icon: Gauge },
  { href: "/education-map", label: "Education Map", icon: MapTrifold },
  { href: "/alerts", label: "Alerts & Exceptions", icon: Warning },
  { href: "/zoho-access", label: "Zoho Classes Access", icon: SignIn },
  { href: "/directory", label: "Directory", icon: AddressBook },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

export const MOBILE_NAV_ITEMS: NavItem[] = PRIMARY_NAV_ITEMS.slice(0, 5);
