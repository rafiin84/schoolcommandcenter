import { useQuery } from "@tanstack/react-query";
import {
  getBlockSummaries,
  getDistrictSummaries,
  getEducationMapData,
  getSchoolDetails,
} from "@/lib/api";
import type { MapFiltersInput } from "@/lib/schemas/filters";

export function useDistrictSummaries() {
  return useQuery({
    queryKey: ["district-summaries"],
    queryFn: () => getDistrictSummaries(),
  });
}

export function useBlockSummaries(districtId: string | null) {
  return useQuery({
    queryKey: ["block-summaries", districtId],
    queryFn: () => getBlockSummaries(districtId as string),
    enabled: Boolean(districtId),
  });
}

export function useSchoolDetails(schoolId: string | null) {
  return useQuery({
    queryKey: ["school-details", schoolId],
    queryFn: () => getSchoolDetails(schoolId as string),
    enabled: Boolean(schoolId),
  });
}

export function useEducationMapData(filters: MapFiltersInput) {
  return useQuery({
    queryKey: ["education-map-data", filters],
    queryFn: () => getEducationMapData(filters),
  });
}
