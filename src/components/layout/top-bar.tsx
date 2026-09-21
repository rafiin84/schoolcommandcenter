"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { pageTitleFor } from "@/components/navigation/nav-items";

export function TopBar() {
  const pathname = usePathname();
  const title = pageTitleFor(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center">
        <span className="text-base font-semibold text-foreground truncate">{title}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <ThemeToggle />
        <NotificationBell />
        <Avatar className="ml-1 size-9" aria-label="Signed in as State Education Reviewer">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            SR
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
