import type { ApiResponse, Notification } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import {
  type NotificationFiltersInput,
  notificationFiltersSchema,
} from "@/lib/schemas/filters";
import { MockApiError, simulateNetwork, withEnvelope } from "./helpers";

export async function getNotifications(
  filters: NotificationFiltersInput = {},
): Promise<ApiResponse<Notification[]>> {
  const parsed = notificationFiltersSchema.safeParse(filters);
  if (!parsed.success) {
    throw new MockApiError("Invalid notification filter input.", "invalid_input");
  }
  const f = parsed.data;

  return simulateNetwork(() => {
    const db = getDatabase();
    let notifications = [...db.notifications];

    if (f.type && f.type.length > 0) {
      notifications = notifications.filter((n) => f.type!.includes(n.type));
    }
    if (f.unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    return withEnvelope(notifications, "Illustrative notifications feed (mock)");
  });
}
