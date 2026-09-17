"use client";

import Link from "next/link";
import { Bell } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationPreviewList } from "./notification-preview-list";

export function NotificationBell() {
  const { data, isLoading } = useNotifications();
  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-10 rounded-full"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          />
        }
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-status-critical" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          <Link
            href="/notifications"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <NotificationPreviewList
          notifications={notifications.slice(0, 5)}
          isLoading={isLoading}
        />
      </PopoverContent>
    </Popover>
  );
}
