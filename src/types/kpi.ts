import type { GeographyLevel, TrendDirection } from "./common";

export interface KpiSnapshot {
  id: string;
  scopeType: GeographyLevel;
  scopeId: string;
  capturedAt: string;
  schoolsOnboarded: number;
  totalSchools: number;
  studentAccounts: number;
  teacherAccounts: number;
  activeAccounts: number;
  lessonAccessRate: number;
  engagementRate: number;
  readinessRate: number;
  openIssueCount: number;
  targetVariance: number;
  trendDirection: TrendDirection;
  sourceLabel: string;
}

export type KpiMetricKey =
  | "deployment"
  | "engagement"
  | "operationalHealth";

export interface KpiTrendPoint {
  date: string;
  value: number;
}

export interface KpiTrendSeries {
  metric: KpiMetricKey;
  label: string;
  unit: "percent" | "count";
  points: KpiTrendPoint[];
}
