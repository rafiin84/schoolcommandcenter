import type { AlertException, ApiResponse } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import { type AlertFiltersInput, alertFiltersSchema } from "@/lib/schemas/filters";
import { MockApiError, simulateNetwork, withEnvelope } from "./helpers";

const PRIORITY_RANK = { critical: 3, high: 2, medium: 1, low: 0 } as const;

export async function getAlerts(
  filters: AlertFiltersInput = { sortBy: "priority" },
): Promise<ApiResponse<AlertException[]>> {
  const parsed = alertFiltersSchema.safeParse(filters);
  if (!parsed.success) {
    throw new MockApiError("Invalid alert filter input.", "invalid_input");
  }
  const f = parsed.data;

  return simulateNetwork(() => {
    const db = getDatabase();
    let alerts = [...db.alerts];

    if (f.search) {
      const q = f.search.toLowerCase();
      alerts = alerts.filter(
        (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
      );
    }
    if (f.priority && f.priority.length > 0) {
      alerts = alerts.filter((a) => f.priority!.includes(a.priority));
    }
    if (f.status && f.status.length > 0) {
      alerts = alerts.filter((a) => f.status!.includes(a.status));
    }
    if (f.category && f.category.length > 0) {
      alerts = alerts.filter((a) => f.category!.includes(a.category));
    }
    if (f.geographyType) {
      alerts = alerts.filter((a) => a.geographyType === f.geographyType);
    }
    if (f.geographyId) {
      alerts = alerts.filter((a) => a.geographyId === f.geographyId);
    }

    alerts.sort((a, b) => {
      if (f.sortBy === "age") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (f.sortBy === "variance") {
        const varA = Math.abs(a.currentValue - a.targetValue);
        const varB = Math.abs(b.currentValue - b.targetValue);
        return varB - varA;
      }
      return PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
    });

    return withEnvelope(alerts, "Illustrative alerts & exceptions (mock)");
  });
}

export async function getAlertDetails(
  alertId: string,
): Promise<ApiResponse<AlertException>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    const alert = db.alerts.find((a) => a.id === alertId);
    if (!alert) {
      throw new MockApiError(`No alert found with id ${alertId}`, "not_found");
    }
    return withEnvelope(alert, "Illustrative alert detail (mock)");
  });
}
