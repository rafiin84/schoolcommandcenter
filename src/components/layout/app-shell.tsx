import { TopNav } from "@/components/layout/top-nav";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { MobileMenuSheet } from "@/components/layout/mobile-menu-sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <MobileNavigation />
      <MobileMenuSheet />
    </div>
  );
}
