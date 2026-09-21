import { useQuery } from "@tanstack/react-query";
import { getModuleUsage } from "@/lib/api";

export function useModuleUsage() {
  return useQuery({
    queryKey: ["module-usage"],
    queryFn: getModuleUsage,
  });
}
