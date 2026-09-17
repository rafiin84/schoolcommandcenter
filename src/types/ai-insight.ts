import type { GeographyLevel, InsightStatus, InsightType } from "./common";

export interface SupportingMetric {
  label: string;
  value: string;
  changeLabel: string | null;
}

/**
 * Mock, illustrative AI output. Every field is written to be inspectable:
 * `supportingMetrics` and `reasoningContext` exist so a leader can trace
 * the interpretation back to the underlying (mock) evidence rather than
 * treating the insight as a verified fact.
 */
export interface AiInsight {
  id: string;
  title: string;
  summary: string;
  insightType: InsightType;
  scopeType: GeographyLevel;
  scopeId: string;
  generatedAt: string;
  confidenceContext: string;
  supportingMetrics: SupportingMetric[];
  reasoningContext: string;
  suggestedActions: string[];
  disclaimer: string;
  status: InsightStatus;
}
