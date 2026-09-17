import { useQuery } from "@tanstack/react-query";
import { getAlertDetails, getAlerts } from "@/lib/api";
import type { AlertFiltersInput } from "@/lib/schemas/filters";

export function useAlerts(filters: AlertFiltersInput) {
  return useQuery({
    queryKey: ["alerts", filters],
    queryFn: () => getAlerts(filters),
  });
}

export function useAlertDetails(alertId: string | null) {
  return useQuery({
    queryKey: ["alert-details", alertId],
    queryFn: () => getAlertDetails(alertId as string),
    enabled: Boolean(alertId),
  });
}
