"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PRIMARY_NAV_ITEMS } from "@/components/navigation/nav-items";
import { cn } from "@/lib/utils";

// Two-row header matching the Zoho Classes web app: brand + utilities on top,
// icon tabs with an indigo underline for the current section below.
export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link href="/overview" className="flex flex-col items-start leading-none" aria-label="Zoho Classes — School Command Center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/zoho-classes-logo.png" alt="Zoho Classes" className="h-9 w-auto max-w-none shrink-0 object-contain dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/zoho-classes-logo-white.png" alt="Zoho Classes" className="hidden h-9 w-auto max-w-none shrink-0 object-contain dark:block" />
          <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">School Command Center</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <NotificationBell />
          <Avatar className="ml-1 size-9" aria-label="Signed in as State Education Reviewer">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              SR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="hidden items-center justify-center gap-1 overflow-x-auto border-t border-border/60 px-4 md:flex"
      >
        {PRIMARY_NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive && "border-primary text-primary hover:text-primary",
              )}
            >
              <Icon size={18} weight="fill" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
