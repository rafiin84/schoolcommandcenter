import type { Announcement } from "@/types";

export function AnnouncementStatsCard({ announcements }: { announcements: Announcement[] }) {
  const statewide = announcements.filter((a) => a.districtId === null).length;
  const districtCount = new Set(announcements.map((a) => a.districtId).filter(Boolean)).size;
  const stats = [
    { label: "Announcements posted", value: announcements.length },
    { label: "Statewide announcements", value: statewide },
    { label: "Districts reached", value: districtCount },
  ];

  return (
    <aside className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-base font-medium text-foreground">Overall statistics</h2>
      <dl className="flex flex-col gap-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="text-xl font-semibold tabular-nums text-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
