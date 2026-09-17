import { useQuery } from "@tanstack/react-query";
import { getAiInsights, getSupportingMetrics, type AiInsightScope } from "@/lib/api";

export function useAiInsights(scope?: AiInsightScope) {
  return useQuery({
    queryKey: ["ai-insights", scope?.scopeType, scope?.scopeId],
    queryFn: () => getAiInsights(scope),
  });
}

export function useSupportingMetrics(insightId: string | null) {
  return useQuery({
    queryKey: ["supporting-metrics", insightId],
    queryFn: () => getSupportingMetrics(insightId as string),
    enabled: Boolean(insightId),
  });
}
