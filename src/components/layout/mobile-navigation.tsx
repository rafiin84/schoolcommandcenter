"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react/dist/ssr";
import { MOBILE_NAV_ITEMS, MOBILE_OVERFLOW_NAV_ITEMS } from "@/components/navigation/nav-items";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();
  const isMoreOpen = useUiStore((s) => s.isMobileNavOpen);
  const setMoreOpen = useUiStore((s) => s.setMobileNavOpen);
  const isMoreActive = MOBILE_OVERFLOW_NAV_ITEMS.some((item) => pathname.startsWith(item.href));

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground transition-colors",
              isActive && "text-primary",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={21} weight={isActive ? "fill" : "regular"} />
            <span className="leading-none">{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setMoreOpen(!isMoreOpen)}
        className={cn(
          "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground transition-colors",
          isMoreActive && "text-primary",
        )}
        aria-haspopup="menu"
        aria-expanded={isMoreOpen}
      >
        <List size={21} weight={isMoreActive ? "fill" : "regular"} />
        <span className="leading-none">More</span>
      </button>
    </nav>
  );
}
