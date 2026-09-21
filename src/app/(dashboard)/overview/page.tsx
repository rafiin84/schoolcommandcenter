"use client";

import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  ChartLineUp,
  CheckCircle,
  GraduationCap,
  MapTrifold,
  UsersThree,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ModuleUsageGrid } from "@/components/dashboard/module-usage-grid";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { DistrictHealthGrid } from "@/components/dashboard/district-health-grid";
import { AlertCard } from "@/components/alerts/alert-card";
import { AiInsightCard } from "@/components/ai/ai-insight-card";
import { NotificationPreviewList } from "@/components/notifications/notification-preview-list";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { KpiGridSkeleton, ChartSkeleton, ListSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { useOverviewMetrics, useKpiTrend } from "@/hooks/use-overview";
import { useDistrictSummaries } from "@/hooks/use-map";
import { useAlerts } from "@/hooks/use-alerts";
import { useAiInsights } from "@/hooks/use-ai-insights";
import { useNotifications } from "@/hooks/use-notifications";
import { useModuleUsage } from "@/hooks/use-module-usage";
import { formatCompactNumber, formatPercent } from "@/lib/formatters";

export default function OverviewPage() {
  const overview = useOverviewMetrics();
  const trend = useKpiTrend({ scopeType: "state", scopeId: "tamil-nadu" });
  const districts = useDistrictSummaries();
  const alerts = useAlerts({ sortBy: "priority", status: ["open"] });
  const insights = useAiInsights();
  const notifications = useNotifications();
  const moduleUsage = useModuleUsage();

  const snapshot = overview.data?.data.stateSnapshot;

  return (
    <ContentContainer>
      <PageHeader
        eyebrow="Tamil Nadu · Statewide"
        title="Overview"
        description="A one-minute read on Zoho Classes deployment, engagement, and operational health across Tamil Nadu."
        actions={
          <Button render={<Link href="/education-map" />} nativeButton={false} className="gap-2">
            <MapTrifold size={16} />
            Open Education Map
          </Button>
        }
      />

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
        />
        {moduleUsage.isLoading ? (
          <KpiGridSkeleton count={8} />
        ) : moduleUsage.isError ? (
          <ErrorState onRetry={() => moduleUsage.refetch()} />
        ) : moduleUsage.data ? (
          <ModuleUsageGrid stats={moduleUsage.data.data} />
        ) : null}
      </section>

      <section aria-labelledby="trend-heading" className="mb-8 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <SectionHeader
          title="Statewide trend"
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

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section aria-labelledby="map-preview-heading" className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
          <SectionHeader
            title="Living Tamil Nadu education map"
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

        <section aria-labelledby="notifications-preview-heading" className="lg:col-span-2 rounded-2xl border border-border bg-card">
          <div className="p-4 pb-0 sm:p-6 sm:pb-0">
            <SectionHeader
              title="Notifications"
              actions={
                <Link href="/notifications" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  View all <ArrowRight size={14} />
                </Link>
              }
            />
          </div>
          <NotificationPreviewList
            notifications={notifications.data?.data.slice(0, 5) ?? []}
            isLoading={notifications.isLoading}
          />
        </section>
      </div>

      <section aria-labelledby="alerts-preview-heading" className="mb-8">
        <SectionHeader
          title="Alerts & exceptions"
          description="Highest-priority open items across the state."
          actions={
            <Link href="/alerts" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          }
        />
        {alerts.isLoading ? (
          <ListSkeleton count={3} />
        ) : alerts.isError ? (
          <ErrorState onRetry={() => alerts.refetch()} />
        ) : alerts.data && alerts.data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {alerts.data.data.slice(0, 3).map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            title="No open alerts"
            description="There are currently no open alerts requiring attention statewide."
          />
        )}
      </section>

      <section aria-labelledby="ai-preview-heading" className="mb-4">
        <SectionHeader
          title="AI insights"
          description="Illustrative AI analysis generated from this mock dataset — inspect before acting."
        />
        {insights.isLoading ? (
          <ListSkeleton count={2} />
        ) : insights.isError ? (
          <ErrorState onRetry={() => insights.refetch()} />
        ) : insights.data && insights.data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {insights.data.data.slice(0, 2).map((insight) => (
              <AiInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No insights available"
            description="AI insights will appear here once patterns are detected in the mock dataset."
          />
        )}
      </section>
    </ContentContainer>
  );
}
