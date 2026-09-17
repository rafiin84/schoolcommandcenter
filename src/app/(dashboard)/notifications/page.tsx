"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle, EnvelopeOpen } from "@phosphor-icons/react/dist/ssr";
import type { NotificationType } from "@/types";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { NotificationPreviewList } from "@/components/notifications/notification-preview-list";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/use-notifications";
import { NOTIFICATION_TYPE_LABEL } from "@/lib/constants";

type TabValue = "all" | "unread" | NotificationType;

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "alert", label: NOTIFICATION_TYPE_LABEL.alert },
  { value: "deployment", label: NOTIFICATION_TYPE_LABEL.deployment },
  { value: "engagement", label: NOTIFICATION_TYPE_LABEL.engagement },
  { value: "system", label: NOTIFICATION_TYPE_LABEL.system },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState<TabValue>("all");
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>({});

  const notifications = useNotifications();

  const filtered = useMemo(() => {
    const data = (notifications.data?.data ?? []).map((n) => ({
      ...n,
      read: readOverrides[n.id] ?? n.read,
    }));
    if (tab === "all") return data;
    if (tab === "unread") return data.filter((n) => !n.read);
    return data.filter((n) => n.type === tab);
  }, [notifications.data, tab, readOverrides]);

  const unreadCount = (notifications.data?.data ?? []).filter((n) => !(readOverrides[n.id] ?? n.read)).length;

  function markAllRead() {
    const ids = notifications.data?.data.map((n) => n.id) ?? [];
    setReadOverrides(Object.fromEntries(ids.map((id) => [id, true])));
    toast.success("All notifications marked as read (simulated)");
  }

  return (
    <ContentContainer className="max-w-4xl">
      <PageHeader
        eyebrow="Tamil Nadu · Updates"
        title="Notifications"
        description="Executive updates, alerts, and system notices in one place."
        actions={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
              <EnvelopeOpen size={15} />
              Mark all as read
            </Button>
          )
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="mb-4">
        <TabsList className="flex-wrap">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-2xl border border-border bg-card">
        {notifications.isLoading ? (
          <div className="p-4">
            <ListSkeleton count={6} />
          </div>
        ) : notifications.isError ? (
          <div className="p-4">
            <ErrorState onRetry={() => notifications.refetch()} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={CheckCircle}
              title="Nothing here"
              description="There are no notifications matching this filter right now."
            />
          </div>
        ) : (
          <NotificationPreviewList notifications={filtered} />
        )}
      </div>
    </ContentContainer>
  );
}
