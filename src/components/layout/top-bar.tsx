"use client";

import { List } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchCommand } from "@/components/navigation/search-command";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useUiStore } from "@/store/ui-store";

export function TopBar() {
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 md:hidden"
        aria-label="Open navigation menu"
        onClick={() => setMobileNavOpen(true)}
      >
        <List size={20} />
      </Button>

      <div className="hidden flex-1 md:flex md:justify-start">
        <SearchCommand />
      </div>
      <div className="flex flex-1 md:hidden">
        <span className="text-sm font-semibold">School Command Center</span>
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
