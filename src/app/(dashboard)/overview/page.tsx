"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  ChartLineUp,
  CheckCircle,
  Gauge,
  GraduationCap,
  MapPin,
  UsersThree,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { SectionHeader } from "@/components/layout/section-header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ModuleUsageGrid, MODULE_USAGE_PERIODS, type ModuleUsagePeriod } from "@/components/dashboard/module-usage-grid";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { DistrictHealthGrid } from "@/components/dashboard/district-health-grid";
import { ErrorState } from "@/components/shared/error-state";
import { KpiGridSkeleton, ChartSkeleton, ListSkeleton } from "@/components/shared/skeletons";
import { useOverviewMetrics, useKpiTrend } from "@/hooks/use-overview";
import { useDistrictSummaries } from "@/hooks/use-map";
import { ReportCharts } from "@/components/reports/report-charts-section";
import { buildReportMetrics } from "@/components/reports/report-metrics";
import { useReports } from "@/hooks/use-reports";
import { useModuleUsage } from "@/hooks/use-module-usage";
import { formatCompactNumber, formatPercent } from "@/lib/formatters";

export default function OverviewPage() {
  const overview = useOverviewMetrics();
  const trend = useKpiTrend({ scopeType: "state", scopeId: "tamil-nadu" });
  const districts = useDistrictSummaries();
  const reports = useReports();
  const reportData = reports.data?.data;
  const reportMetrics = useMemo(() => (reportData ? buildReportMetrics(reportData) : null), [reportData]);
  const moduleUsage = useModuleUsage();
  const [usagePeriod, setUsagePeriod] = useState<ModuleUsagePeriod>("month");

  const snapshot = overview.data?.data.stateSnapshot;

  return (
    <ContentContainer className="pt-3 sm:pt-4 lg:pt-4">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            Z
          </span>
          <div>
            <p className="text-lg text-foreground">Hi, State Reviewer</p>
            <h1 className="text-xl font-semibold text-foreground">
              Welcome to <span className="text-primary">School Command Center</span>
            </h1>
          </div>
        </div>
      </div>

      <section aria-labelledby="kpi-heading" className="mb-8">
        <h2 id="kpi-heading" className="sr-only">
          Key performance indicators
        </h2>
        {overview.isLoading ? (
          <KpiGridSkeleton count={8} />
        ) : overview.isError ? (
          <ErrorState onRetry={() => overview.refetch()} />
        ) : snapshot ? (
          <KpiGrid
            title="statewide statistics"
            variant="banner"
            cards={[
              {
                label: "Schools onboarded",
                value: `${formatCompactNumber(snapshot.schoolsOnboarded)} / ${formatCompactNumber(snapshot.totalSchools)}`,
                helpText: `${formatPercent(snapshot.readinessRate)} of statewide target reached`,
                trend: { direction: snapshot.trendDirection, label: `${snapshot.targetVariance >= 0 ? "+" : ""}${snapshot.targetVariance} pts vs target` },
                icon: Buildings,
                href: "/education-map",
                tone: "navy",
              },
              {
                label: "Student accounts created",
                value: formatCompactNumber(snapshot.studentAccounts),
                helpText: "Cumulative, statewide",
                icon: GraduationCap,
                href: "/education-map",
                tone: "blue",
              },
              {
                label: "Teacher accounts created",
                value: formatCompactNumber(snapshot.teacherAccounts),
                helpText: "Cumulative, statewide",
                icon: UsersThree,
                href: "/education-map",
                tone: "teal",
              },
              {
                label: "Active accounts",
                value: formatCompactNumber(snapshot.activeAccounts),
                helpText: "Illustrative weekly active usage",
                icon: CheckCircle,
                tone: "green",
              },
              {
                label: "Engagement rate",
                value: formatPercent(snapshot.engagementRate),
                helpText: "Average across onboarded schools",
                icon: ChartLineUp,
                tone: "pink",
              },
              {
                label: "Readiness rate",
                value: formatPercent(snapshot.readinessRate),
                helpText: "Share of schools fully onboarded",
                icon: Gauge,
                tone: "amber",
              },
              {
                label: "Open issues",
                value: formatCompactNumber(snapshot.openIssueCount),
                helpText: "Across all open alerts",
                icon: Warning,
                href: "/alerts",
                tone: "red",
              },
              {
                label: "District coverage",
                value: `${overview.data!.data.districtsOnTrack} / ${overview.data!.data.totalDistricts}`,
                helpText: "Districts on track vs. statewide target",
                icon: MapPin,
                tone: "orange",
              },
            ]}
          />
        ) : null}
      </section>

      <section aria-labelledby="module-usage-heading" className="mb-8">
        <SectionHeader
          title="Zoho Classes module activity"
          description="Statewide usage across Zoho Classes content modules."
          actions={
            <select
              value={usagePeriod}
              onChange={(e) => setUsagePeriod(e.target.value as ModuleUsagePeriod)}
              aria-label="Module activity period"
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {MODULE_USAGE_PERIODS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          }
        />
        {moduleUsage.isLoading ? (
          <KpiGridSkeleton count={8} />
        ) : moduleUsage.isError ? (
          <ErrorState onRetry={() => moduleUsage.refetch()} />
        ) : moduleUsage.data ? (
          <ModuleUsageGrid stats={moduleUsage.data.data} period={usagePeriod} />
        ) : null}
      </section>

      <section aria-labelledby="trend-heading" className="mb-8 rounded-lg border border-border bg-card p-4 sm:p-6">
        <SectionHeader
          title="Trend"
          description="Weekly rollup across the last reporting cycles. Toggle a series or switch the time range."
        />
        {trend.isLoading ? (
          <ChartSkeleton />
        ) : trend.isError ? (
          <ErrorState onRetry={() => trend.refetch()} />
        ) : trend.data ? (
          <TrendChart series={trend.data.data} />
        ) : null}
      </section>

      <div className="mb-8">
        <section aria-labelledby="map-preview-heading" className="rounded-lg border border-border bg-card p-4 sm:p-6">
          <SectionHeader
            title="Map"
            description="District operational health at a glance."
            actions={
              <Link href="/education-map" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Open map <ArrowRight size={14} />
              </Link>
            }
          />
          {districts.isLoading ? (
            <ListSkeleton count={3} />
          ) : districts.isError ? (
            <ErrorState onRetry={() => districts.refetch()} />
          ) : districts.data ? (
            <DistrictHealthGrid districts={districts.data.data} />
          ) : null}
        </section>

      </div>

      {reports.isLoading ? (
        <ChartSkeleton />
      ) : reports.isError ? (
        <ErrorState onRetry={() => reports.refetch()} />
      ) : reportData && reportMetrics ? (
        <ReportCharts data={reportData} metrics={reportMetrics} />
      ) : null}
    </ContentContainer>
  );
}
