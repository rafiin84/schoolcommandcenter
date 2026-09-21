import { ArrowsClockwise, Clock } from "@phosphor-icons/react/dist/ssr";
import type { Announcement } from "@/types";
import { formatRelativeTime } from "@/lib/formatters";

export function AnnouncementRecentActivity({ announcements }: { announcements: Announcement[] }) {
  const recent = announcements.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Clock size={13} />
        Recent activity
      </p>
      <ul className="flex flex-col gap-3">
        {recent.map((a) => (
          <li key={a.id} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-status-info/10 text-status-info">
              <ArrowsClockwise size={12} />
            </span>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm text-foreground">
                {a.title} — <span className="text-muted-foreground">{a.authorName}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(a.createdAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
