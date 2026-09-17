"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapTrifold } from "@phosphor-icons/react/dist/ssr";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PRIMARY_NAV_ITEMS } from "@/components/navigation/nav-items";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function MobileMenuSheet() {
  const isOpen = useUiStore((s) => s.isMobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="flex-row items-center gap-2.5 space-y-0 border-b border-border px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MapTrifold size={20} weight="fill" />
          </span>
          <SheetTitle className="text-sm">School Command Center</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3" aria-label="Primary">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={19} weight={isActive ? "fill" : "regular"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
