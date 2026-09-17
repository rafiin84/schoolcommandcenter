import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { MobileMenuSheet } from "@/components/layout/mobile-menu-sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
      </div>
      <MobileNavigation />
      <MobileMenuSheet />
    </div>
  );
}
