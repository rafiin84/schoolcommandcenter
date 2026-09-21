import { useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "@/lib/api";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => getAnnouncements(),
  });
}
