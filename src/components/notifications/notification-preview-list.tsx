import Link from "next/link";
import {
  Bell,
  BellRinging,
  ChartLineUp,
  Gear,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import type { Notification, NotificationType } from "@/types";
import { formatRelativeTime } from "@/lib/formatters";
import { EmptyState } from "@/components/shared/empty-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<NotificationType, React.ComponentType<{ size?: number; className?: string }>> = {
  alert: Warning,
  deployment: ChartLineUp,
  system: Gear,
  engagement: BellRinging,
};

const TYPE_UNREAD_CLASS: Record<NotificationType, string> = {
  alert: "bg-status-critical/12 text-status-critical",
  deployment: "bg-chart-1/15 text-chart-1",
  system: "bg-brand-accent/15 text-brand-accent",
  engagement: "bg-chart-5/15 text-chart-5",
};

function linkFor(notification: Notification): string {
  if (notification.linkedEntityType === "alert" && notification.linkedEntityId) {
    return `/alerts/${notification.linkedEntityId}`;
  }
  if (
    (notification.linkedEntityType === "district" ||
      notification.linkedEntityType === "block" ||
      notification.linkedEntityType === "school") &&
    notification.linkedEntityId
  ) {
    return `/education-map?focus=${notification.linkedEntityId}`;
  }
  return "/notifications";
}

export function NotificationPreviewList({
  notifications,
  isLoading,
}: {
  notifications: Notification[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="p-3">
        <ListSkeleton count={3} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="There are no notifications to show right now."
        />
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {notifications.map((notification) => {
        const Icon = TYPE_ICON[notification.type];
        return (
          <li key={notification.id}>
            <Link
              href={linkFor(notification)}
              className="flex gap-3 px-4 py-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                  notification.read ? "bg-muted text-muted-foreground" : TYPE_UNREAD_CLASS[notification.type],
                )}
              >
                <Icon size={16} />
              </span>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "truncate text-sm",
                      notification.read ? "font-medium text-foreground/80" : "font-semibold text-foreground",
                    )}
                  >
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="size-1.5 shrink-0 rounded-full bg-status-info" aria-hidden />
                  )}
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{notification.body}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
