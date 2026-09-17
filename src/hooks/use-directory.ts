import { useQuery } from "@tanstack/react-query";
import { getLeadershipDirectory } from "@/lib/api";
import type { DirectoryFiltersInput } from "@/lib/schemas/filters";

export function useLeadershipDirectory(filters: DirectoryFiltersInput) {
  return useQuery({
    queryKey: ["leadership-directory", filters],
    queryFn: () => getLeadershipDirectory(filters),
  });
}
