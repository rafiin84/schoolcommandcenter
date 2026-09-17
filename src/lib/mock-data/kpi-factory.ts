import type {
  DistrictSummary,
  KpiMetricKey,
  KpiSnapshot,
  KpiTrendPoint,
  KpiTrendSeries,
  School,
  TrendDirection,
} from "@/types";
import { clamp, createRng, randFloat } from "./prng";

const TREND_WEEKS = 14;

function computeSnapshot(
  scopeType: KpiSnapshot["scopeType"],
  scopeId: string,
  schoolsInScope: School[],
  totalSchools: number,
  sourceLabel: string,
  openIssueCount: number,
): KpiSnapshot {
  const schoolsOnboarded = schoolsInScope.filter(
    (s) => s.onboardingStatus === "onboarded",
  ).length;
  const studentAccounts = schoolsInScope.reduce(
    (sum, s) => sum + s.studentAccountsCreated,
    0,
  );
  const teacherAccounts = schoolsInScope.reduce(
    (sum, s) => sum + s.teacherAccountsCreated,
    0,
  );
  const activeAccounts = schoolsInScope.reduce((sum, s) => {
    const engagedShare = s.engagementRate / 100;
    return sum + Math.round((s.studentAccountsCreated + s.teacherAccountsCreated) * engagedShare);
  }, 0);
  const avgEngagement =
    schoolsInScope.length > 0
      ? Math.round(
          schoolsInScope.reduce((sum, s) => sum + s.engagementRate, 0) /
            schoolsInScope.length,
        )
      : 0;
  const readinessRate =
    schoolsInScope.length > 0
      ? Math.round((schoolsOnboarded / schoolsInScope.length) * 100)
      : 0;
  const lessonAccessRate = clamp(
    Math.round(avgEngagement * 0.9 + randFloat(createRng(`lesson:${scopeId}`), -3, 3, 0)),
    0,
    100,
  );
  const targetVariance = readinessRate - 90;
  const trendDirection: TrendDirection =
    targetVariance >= -3 ? "up" : targetVariance <= -20 ? "down" : "flat";

  return {
    id: `kpi-${scopeType}-${scopeId}`,
    scopeType,
    scopeId,
    capturedAt: new Date().toISOString(),
    schoolsOnboarded,
    totalSchools,
    studentAccounts,
    teacherAccounts,
    activeAccounts,
    lessonAccessRate,
    engagementRate: avgEngagement,
    readinessRate,
    openIssueCount,
    targetVariance,
    trendDirection,
    sourceLabel,
  };
}

export function computeStateSnapshot(
  schools: School[],
  totalOpenIssueCount: number,
): KpiSnapshot {
  return computeSnapshot(
    "state",
    "tamil-nadu",
    schools,
    schools.length,
    "Illustrative statewide rollup — Zoho Classes Command Center (mock)",
    totalOpenIssueCount,
  );
}

export function computeDistrictSnapshots(
  districts: DistrictSummary[],
  schools: School[],
  openIssueCountByDistrict: Map<string, number>,
): KpiSnapshot[] {
  return districts.map((district) => {
    const schoolsInScope = schools.filter((s) => s.districtId === district.id);
    return computeSnapshot(
      "district",
      district.id,
      schoolsInScope,
      schoolsInScope.length,
      `Illustrative rollup for ${district.name} district (mock)`,
      openIssueCountByDistrict.get(district.id) ?? 0,
    );
  });
}

const METRIC_LABELS: Record<KpiMetricKey, string> = {
  deployment: "Deployment Progress",
  engagement: "Engagement Rate",
  operationalHealth: "Operational Health",
};

function generateSeriesPoints(
  seed: string,
  endValue: number,
): KpiTrendPoint[] {
  const rng = createRng(seed);
  const points: number[] = [endValue];
  for (let i = 1; i < TREND_WEEKS; i++) {
    const prev = points[i - 1];
    const drift = randFloat(rng, -4.5, 3.5, 1);
    points.push(clamp(prev - drift, 4, 99));
  }
  points.reverse();

  const today = new Date();
  return points.map((value, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (TREND_WEEKS - 1 - index) * 7);
    return { date: date.toISOString().slice(0, 10), value: Math.round(value * 10) / 10 };
  });
}

export function generateKpiTrend(
  scopeType: KpiSnapshot["scopeType"],
  scopeId: string,
  snapshot: Pick<KpiSnapshot, "readinessRate" | "engagementRate">,
): KpiTrendSeries[] {
  const deploymentPoints = generateSeriesPoints(
    `trend:deployment:${scopeType}:${scopeId}`,
    snapshot.readinessRate,
  );
  const engagementPoints = generateSeriesPoints(
    `trend:engagement:${scopeType}:${scopeId}`,
    snapshot.engagementRate,
  );
  const operationalSeed = createRng(`trend:operational:${scopeType}:${scopeId}`);
  const operationalEnd = clamp(
    (snapshot.readinessRate + snapshot.engagementRate) / 2 +
      randFloat(operationalSeed, -6, 6, 1),
    5,
    99,
  );
  const operationalPoints = generateSeriesPoints(
    `trend:operational:${scopeType}:${scopeId}`,
    operationalEnd,
  );

  return [
    {
      metric: "deployment",
      label: METRIC_LABELS.deployment,
      unit: "percent",
      points: deploymentPoints,
    },
    {
      metric: "engagement",
      label: METRIC_LABELS.engagement,
      unit: "percent",
      points: engagementPoints,
    },
    {
      metric: "operationalHealth",
      label: METRIC_LABELS.operationalHealth,
      unit: "percent",
      points: operationalPoints,
    },
  ];
}

export { TREND_WEEKS };
export type { KpiMetricKey };
