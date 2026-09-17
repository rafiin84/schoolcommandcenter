import { useQuery } from "@tanstack/react-query";
import { getZohoAccountDirectory, getZohoAccountForSchool } from "@/lib/api";

export function useZohoAccountForSchool(schoolId: string | null) {
  return useQuery({
    queryKey: ["zoho-account", schoolId],
    queryFn: () => getZohoAccountForSchool(schoolId as string),
    enabled: Boolean(schoolId),
  });
}

export function useZohoAccountDirectory() {
  return useQuery({
    queryKey: ["zoho-account-directory"],
    queryFn: () => getZohoAccountDirectory(),
  });
}
