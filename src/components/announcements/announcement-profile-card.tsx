import { Megaphone } from "@phosphor-icons/react/dist/ssr";
import type { Announcement } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/formatters";

export function AnnouncementProfileCard({ announcements }: { announcements: Announcement[] }) {
  const recent = announcements.slice(0, 4);

  return (
    <aside className="rounded-lg border border-border bg-card">
      <div className="flex flex-col items-center gap-3 px-4 pt-6 pb-4">
        <Avatar className="size-16">
          <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">SR</AvatarFallback>
        </Avatar>
        <p className="text-base font-medium text-foreground">State Reviewer</p>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">Admin</span>
      </div>

      <section className="border-t border-border px-4 py-4">
        <h2 className="mb-3 text-sm text-muted-foreground">My Recent Announcements</h2>
        <ul className="flex flex-col divide-y divide-border">
          {recent.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Megaphone size={14} weight="fill" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(a.createdAt)}</p>
              </div>
            </li>
          ))}
          {recent.length === 0 && <li className="py-2 text-sm text-muted-foreground">Nothing posted yet.</li>}
        </ul>
      </section>

      <section className="border-t border-border px-4 py-4">
        <h2 className="mb-3 text-sm text-muted-foreground">Scheduled Announcements</h2>
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <Megaphone size={36} />
          <p className="text-xs">No scheduled announcements</p>
        </div>
      </section>
    </aside>
  );
}
