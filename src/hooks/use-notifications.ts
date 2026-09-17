import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/lib/api";
import type { NotificationFiltersInput } from "@/lib/schemas/filters";

export function useNotifications(filters: NotificationFiltersInput = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => getNotifications(filters),
  });
}
