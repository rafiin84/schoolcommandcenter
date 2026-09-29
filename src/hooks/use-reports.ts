import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/lib/api";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => getReports(),
  });
}
