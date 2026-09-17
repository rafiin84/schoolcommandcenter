import type { AiInsight, ApiResponse, GeographyLevel, SupportingMetric } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import { MockApiError, simulateNetwork, withEnvelope } from "./helpers";

export interface AiInsightScope {
  scopeType: GeographyLevel;
  scopeId: string;
}

export async function getAiInsights(
  scope?: AiInsightScope,
): Promise<ApiResponse<AiInsight[]>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    const insights = scope
      ? db.aiInsights.filter(
          (i) => i.scopeType === scope.scopeType && i.scopeId === scope.scopeId,
        )
      : db.aiInsights;
    return withEnvelope(insights, "Illustrative AI analysis (mock)");
  });
}

export async function getSupportingMetrics(
  insightId: string,
): Promise<ApiResponse<SupportingMetric[]>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    const insight = db.aiInsights.find((i) => i.id === insightId);
    if (!insight) {
      throw new MockApiError(`No AI insight found with id ${insightId}`, "not_found");
    }
    return withEnvelope(insight.supportingMetrics, "Illustrative supporting metrics (mock)");
  });
}
