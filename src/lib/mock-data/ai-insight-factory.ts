import type { AiInsight, DistrictSummary, KpiSnapshot } from "@/types";

const DISCLAIMER =
  "This is an illustrative AI analysis generated from synthetic mock data for demonstration purposes. It is not verified intelligence and should not be treated as a factual claim — use it as a starting point for human review.";

function insightId(scope: string, kind: string): string {
  return `insight-${scope}-${kind}`;
}

export function generateAiInsights(
  stateSnapshot: KpiSnapshot,
  districtSnapshots: KpiSnapshot[],
  districts: DistrictSummary[],
): AiInsight[] {
  const insights: AiInsight[] = [];
  const districtByName = new Map(districts.map((d) => [d.id, d.name]));

  const laggingDistricts = [...districtSnapshots]
    .sort((a, b) => a.readinessRate - b.readinessRate)
    .slice(0, 3);

  insights.push({
    id: insightId("state", "deployment-gap"),
    title: "Uneven onboarding progress across a small group of districts",
    summary: `${laggingDistricts.map((d) => districtByName.get(d.scopeId)).join(", ")} are trailing the statewide onboarding pace, which may indicate localized rollout friction rather than a systemic issue.`,
    insightType: "deployment_gap",
    scopeType: "state",
    scopeId: "tamil-nadu",
    generatedAt: new Date().toISOString(),
    confidenceContext:
      "Based on illustrative readiness-rate variance across 38 mock districts; three districts fall more than 15 points below the statewide average.",
    supportingMetrics: laggingDistricts.map((d) => ({
      label: districtByName.get(d.scopeId) ?? d.scopeId,
      value: `${d.readinessRate}% onboarded`,
      changeLabel: d.trendDirection === "down" ? "Trending down" : "Flat trend",
    })),
    reasoningContext:
      "These three districts show onboarding rates well below the statewide average while neighboring districts progressed on a similar timeline, which suggests the gap is more likely tied to district-level coordination than a platform-wide constraint.",
    suggestedActions: [
      "Review block-level readiness data for the flagged districts.",
      "Contact the responsible district education officers to understand onboarding blockers.",
      "Consider a targeted onboarding sprint before the next reporting cycle.",
    ],
    disclaimer: DISCLAIMER,
    status: "new",
  });

  const engagementDip = [...districtSnapshots]
    .filter((d) => d.trendDirection === "down")
    .sort((a, b) => a.engagementRate - b.engagementRate)
    .slice(0, 3);

  if (engagementDip.length > 0) {
    insights.push({
      id: insightId("state", "engagement-pattern"),
      title: "Engagement softening in a handful of districts",
      summary: `Engagement in ${engagementDip.map((d) => districtByName.get(d.scopeId)).join(", ")} has drifted downward over the last few illustrative reporting cycles.`,
      insightType: "engagement_pattern",
      scopeType: "state",
      scopeId: "tamil-nadu",
      generatedAt: new Date().toISOString(),
      confidenceContext:
        "Derived from illustrative week-over-week engagement trend direction across mock district snapshots.",
      supportingMetrics: engagementDip.map((d) => ({
        label: districtByName.get(d.scopeId) ?? d.scopeId,
        value: `${d.engagementRate}% engagement`,
        changeLabel: "Downward trend",
      })),
      reasoningContext:
        "A sustained downward trend across consecutive mock snapshots could indicate a lapse in classroom usage rather than a one-off dip, though it may also reflect a normal seasonal pattern such as an exam period.",
      suggestedActions: [
        "Cross-check the reporting window against the academic calendar for exam periods.",
        "Ask block education officers to confirm whether device or connectivity issues are contributing factors.",
      ],
      disclaimer: DISCLAIMER,
      status: "new",
    });
  }

  const topPerformers = [...districtSnapshots]
    .filter((d) => d.trendDirection === "up")
    .sort((a, b) => b.readinessRate - a.readinessRate)
    .slice(0, 3);

  if (topPerformers.length > 0) {
    insights.push({
      id: insightId("state", "positive-trend"),
      title: "Consistent momentum in leading districts",
      summary: `${topPerformers.map((d) => districtByName.get(d.scopeId)).join(", ")} continue to show steady onboarding and engagement gains this cycle.`,
      insightType: "positive_trend",
      scopeType: "state",
      scopeId: "tamil-nadu",
      generatedAt: new Date().toISOString(),
      confidenceContext:
        "Based on illustrative readiness rates trending upward across consecutive mock snapshots.",
      supportingMetrics: topPerformers.map((d) => ({
        label: districtByName.get(d.scopeId) ?? d.scopeId,
        value: `${d.readinessRate}% onboarded`,
        changeLabel: "Trending up",
      })),
      reasoningContext:
        "These districts may offer a useful reference model for onboarding sequencing and stakeholder communication that could be adapted by trailing districts.",
      suggestedActions: [
        "Document the onboarding approach used in these districts.",
        "Share practices with district education officers in trailing districts during the next review cycle.",
      ],
      disclaimer: DISCLAIMER,
      status: "new",
    });
  }

  if (stateSnapshot.openIssueCount > 0) {
    insights.push({
      id: insightId("state", "operational-risk"),
      title: "Open issue volume may warrant a support capacity review",
      summary: `${stateSnapshot.openIssueCount} open issues are illustratively logged statewide, concentrated in a smaller set of districts.`,
      insightType: "operational_risk",
      scopeType: "state",
      scopeId: "tamil-nadu",
      generatedAt: new Date().toISOString(),
      confidenceContext:
        "Aggregated from illustrative per-school alert counts across the mock dataset.",
      supportingMetrics: [
        {
          label: "Open issues (statewide)",
          value: `${stateSnapshot.openIssueCount}`,
          changeLabel: null,
        },
      ],
      reasoningContext:
        "A concentration of open issues in a small number of geographies could point to a shared root cause, such as connectivity or device supply, rather than isolated incidents.",
      suggestedActions: [
        "Review the Alerts & Exceptions view filtered by operational category.",
        "Coordinate with district helpdesk coordinators on ticket aging.",
      ],
      disclaimer: DISCLAIMER,
      status: "new",
    });
  }

  return insights;
}
