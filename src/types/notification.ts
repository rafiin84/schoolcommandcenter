import type { NotificationPriority, NotificationType } from "./common";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAt: string;
  read: boolean;
  linkedEntityType: "school" | "district" | "block" | "alert" | null;
  linkedEntityId: string | null;
  actionLabel: string | null;
}
