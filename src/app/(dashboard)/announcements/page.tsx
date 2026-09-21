"use client";

import { useMemo, useState } from "react";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import type { Announcement } from "@/types";
import { ContentContainer } from "@/components/layout/content-container";
import { AnnouncementComposer } from "@/components/announcements/announcement-composer";
import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { AnnouncementRecentActivity } from "@/components/announcements/announcement-recent-activity";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useDistrictSummaries } from "@/hooks/use-map";
import { useAnnouncementStore } from "@/store/announcement-store";
import { cn } from "@/lib/utils";

const ALL = "all";
const STATEWIDE = "statewide";

function groupByRecency(items: Announcement[]) {
  const now = Date.now();
  const groups: { label: string; items: Announcement[] }[] = [
    { label: "Today", items: [] },
    { label: "This week", items: [] },
    { label: "Earlier", items: [] },
  ];
  for (const item of items) {
    const diffDays = (now - new Date(item.createdAt).getTime()) / 86_400_000;
    if (diffDays < 1) groups[0].items.push(item);
    else if (diffDays < 7) groups[1].items.push(item);
    else groups[2].items.push(item);
  }
  return groups.filter((g) => g.items.length > 0);
}

export default function AnnouncementsPage() {
  const [audienceFilter, setAudienceFilter] = useState(ALL);

  const announcements = useAnnouncements();
  const districts = useDistrictSummaries();
  const draftAnnouncements = useAnnouncementStore((s) => s.draftAnnouncements);
  const dismissedIds = useAnnouncementStore((s) => s.dismissedIds);
  const clearAll = useAnnouncementStore((s) => s.clearAll);

  const feed: Announcement[] = useMemo(() => {
    const combined = [...draftAnnouncements, ...(announcements.data?.data ?? [])];
    const dismissed = new Set(dismissedIds);
    return combined
      .filter((a) => !dismissed.has(a.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [draftAnnouncements, announcements.data, dismissedIds]);

  const filtered = useMemo(() => {
    if (audienceFilter === ALL) return feed;
    if (audienceFilter === STATEWIDE) return feed.filter((a) => a.districtId === null);
    return feed.filter((a) => a.districtId === audienceFilter);
  }, [feed, audienceFilter]);

  const groups = useMemo(() => groupByRecency(filtered), [filtered]);

  const districtsWithAnnouncements = useMemo(() => {
    const ids = new Set(feed.map((a) => a.districtId).filter((id): id is string => Boolean(id)));
    return (districts.data?.data ?? []).filter((d) => ids.has(d.id));
  }, [feed, districts.data]);

  return (
    <ContentContainer className="max-w-none px-3 sm:px-4 lg:px-4">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Tamil Nadu · Updates
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[650px_1fr]">
        <div className="w-full lg:max-w-[650px]">
          <AnnouncementComposer />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {[{ id: ALL, label: "All" }, { id: STATEWIDE, label: "Statewide" }, ...districtsWithAnnouncements.map((d) => ({ id: d.id, label: d.name }))].map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAudienceFilter(item.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      audienceFilter === item.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                    aria-pressed={audienceFilter === item.id}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>

            {filtered.length > 0 && (
              <button
                type="button"
                onClick={() => clearAll(filtered.map((a) => a.id))}
                className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:text-destructive/80"
              >
                <Trash size={13} />
                Clear all ({filtered.length})
              </button>
            )}
          </div>

          {announcements.isLoading ? (
            <ListSkeleton count={4} />
          ) : announcements.isError ? (
            <ErrorState onRetry={() => announcements.refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No announcements yet" description="Posted announcements will appear here." />
          ) : (
            <div className="flex flex-col gap-6">
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {group.label}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="flex flex-col gap-4">
                    {group.items.map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <AnnouncementRecentActivity announcements={feed} />
        </div>
      </div>
    </ContentContainer>
  );
}
