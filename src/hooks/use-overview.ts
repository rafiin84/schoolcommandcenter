import { useQuery } from "@tanstack/react-query";
import { getKpiTrend, getOverviewMetrics, type KpiTrendScope } from "@/lib/api";

export function useOverviewMetrics() {
  return useQuery({
    queryKey: ["overview-metrics"],
    queryFn: () => getOverviewMetrics(),
  });
}

export function useKpiTrend(scope: KpiTrendScope) {
  return useQuery({
    queryKey: ["kpi-trend", scope.scopeType, scope.scopeId],
    queryFn: () => getKpiTrend(scope),
  });
}
