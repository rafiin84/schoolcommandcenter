import type { ApiResponse, GeographyLevel, KpiSnapshot, KpiTrendSeries } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import { generateKpiTrend } from "@/lib/mock-data/kpi-factory";
import { simulateNetwork, withEnvelope, MockApiError } from "./helpers";

export interface OverviewMetrics {
  stateSnapshot: KpiSnapshot;
  districtsOnTrack: number;
  districtsAtRisk: number;
  totalDistricts: number;
}

export async function getOverviewMetrics(): Promise<ApiResponse<OverviewMetrics>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    const districtsAtRisk = db.districtSnapshots.filter(
      (s) => s.targetVariance < -15,
    ).length;

    return withEnvelope(
      {
        stateSnapshot: db.stateSnapshot,
        districtsOnTrack: db.districts.length - districtsAtRisk,
        districtsAtRisk,
        totalDistricts: db.districts.length,
      },
      "Illustrative statewide overview (mock)",
    );
  });
}

export interface KpiTrendScope {
  scopeType: GeographyLevel;
  scopeId: string;
}

export async function getKpiTrend(
  scope: KpiTrendScope,
): Promise<ApiResponse<KpiTrendSeries[]>> {
  return simulateNetwork(() => {
    const db = getDatabase();

    if (scope.scopeType === "state") {
      return withEnvelope(
        generateKpiTrend("state", "tamil-nadu", db.stateSnapshot),
        "Illustrative statewide trend (mock)",
      );
    }

    if (scope.scopeType === "district") {
      const snapshot = db.districtSnapshots.find((s) => s.scopeId === scope.scopeId);
      if (!snapshot) {
        throw new MockApiError(`No KPI snapshot found for district ${scope.scopeId}`, "not_found");
      }
      return withEnvelope(
        generateKpiTrend("district", scope.scopeId, snapshot),
        "Illustrative district trend (mock)",
      );
    }

    // Block/school trend: derive an on-the-fly snapshot from the matching
    // hierarchy node so the trend still reflects that entity's own metrics.
    const node = db.hierarchyNodes.find((n) => n.id === scope.scopeId);
    if (!node) {
      throw new MockApiError(`No entity found for scope ${scope.scopeId}`, "not_found");
    }
    return withEnvelope(
      generateKpiTrend(scope.scopeType, scope.scopeId, {
        readinessRate: node.onboardingProgress,
        engagementRate: node.engagementRate,
      }),
      "Illustrative trend (mock)",
    );
  });
}
