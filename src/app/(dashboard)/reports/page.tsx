"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Certificate,
  ChatCircleText,
  ClipboardText,
  DeviceMobile,
  FilePdf,
  Megaphone,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import { ContentContainer } from "@/components/layout/content-container";
import { SectionHeader } from "@/components/layout/section-header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import {
  AreaChart,
  BarChart,
  ChartCard,
  ChartLegend,
  ColumnChart,
  DonutChart,
} from "@/components/reports/report-charts";
import {
  buildModuleTrends,
  buildReportMetrics,
  PERIOD_OPTIONS,
  PLATFORM_COLOR,
  type ReportModuleKey,
  type ReportPeriod,
} from "@/components/reports/report-metrics";
import { ErrorState } from "@/components/shared/error-state";
import { ChartSkeleton, KpiGridSkeleton } from "@/components/shared/skeletons";
import { useReports } from "@/hooks/use-reports";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const PLATFORM_LEGEND = [
  { label: "Android", color: PLATFORM_COLOR.Android },
  { label: "iOS", color: PLATFORM_COLOR.iOS },
];

// Same icon + tone per module as the count tiles above.
const MODULE_ICON: Record<ReportModuleKey, { icon: React.ComponentType<IconProps>; chip: string }> = {
  announcements: { icon: Megaphone, chip: "bg-primary/15 text-primary" },
  courses: { icon: BookOpen, chip: "bg-chart-3/15 text-chart-3" },
  assignments: { icon: ClipboardText, chip: "bg-chart-2/15 text-chart-2" },
  exams: { icon: Certificate, chip: "bg-status-critical/15 text-status-critical" },
  questionPapers: { icon: FilePdf, chip: "bg-brand-accent/15 text-brand-accent" },
  feeds: { icon: ChatCircleText, chip: "bg-chart-1/15 text-chart-1" },
};

const PERIOD_COLUMN: Record<ReportPeriod, string> = { week: "Week", month: "Month", year: "Year" };

function PeriodToggle({ value, onChange }: { value: ReportPeriod; onChange: (period: ReportPeriod) => void }) {
  return (
    <div className="flex rounded-full border border-border p-0.5" role="group" aria-label="Report period">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === option.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const reports = useReports();
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const data = reports.data?.data;
  const metrics = useMemo(() => (data ? buildReportMetrics(data) : null), [data]);
  const trends = useMemo(() => (data ? buildModuleTrends(data, period) : null), [data, period]);

  if (reports.isLoading) {
    return (
      <ContentContainer className="space-y-6">
        <KpiGridSkeleton count={8} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </ContentContainer>
    );
  }

  if (reports.isError || !data || !metrics || !trends) {
    return (
      <ContentContainer>
        <ErrorState onRetry={() => reports.refetch()} />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <section aria-label="Feature counts" className="mb-6">
        <KpiGrid
          cards={[
            { label: "Announcements", value: formatNumber(data.announcements.length), helpText: "Announcements posted", icon: Megaphone, tone: "navy" },
            { label: "Courses", value: formatNumber(data.courses.length), helpText: "Courses published", icon: BookOpen, tone: "green" },
            { label: "Assignments", value: formatNumber(data.assignments.length), helpText: "Assignments created", icon: ClipboardText, tone: "orange" },
            { label: "Exams", value: formatNumber(data.exams.length), helpText: "Exams conducted", icon: Certificate, tone: "red" },
            { label: "Question papers", value: formatNumber(data.questionPapers.length), helpText: "Question papers uploaded", icon: FilePdf, tone: "teal" },
            { label: "Feeds", value: formatNumber(data.feeds.length), helpText: "Class feed posts", icon: ChatCircleText, tone: "blue" },
            {
              label: "Present today",
              value: formatNumber(data.attendance.totalPresent),
              helpText: `${data.attendance.absent} absent · ${data.attendance.classesTaken} classes taken`,
              icon: UsersThree,
              tone: "amber",
            },
            { label: "Registered devices", value: formatNumber(metrics.totalDevices), helpText: "Android and iOS installs", icon: DeviceMobile, tone: "pink" },
          ]}
        />
      </section>

        <section aria-label="Content over time" className="mb-6">
        <SectionHeader
          title="Content by module"
          description={`Items published per ${PERIOD_COLUMN[period].toLowerCase()}, ${trends.rangeLabel}.`}
          actions={<PeriodToggle value={period} onChange={setPeriod} />}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ChartCard
            title="All modules"
            description={`${formatNumber(trends.combined.reduce((sum, p) => sum + p.value, 0))} items in the ${trends.rangeLabel.startsWith("last") ? trends.rangeLabel : `years ${trends.rangeLabel}`}`}
            table={{ columns: [PERIOD_COLUMN[period], "Items"], rows: trends.combined }}
            className="sm:col-span-2 xl:col-span-3"
          >
            <AreaChart data={trends.combined} unit="items" />
          </ChartCard>
          {trends.modules.map((module) => {
            const { icon: Icon, chip } = MODULE_ICON[module.key];
            return (
              <ChartCard
                key={module.key}
                title={module.label}
                description={`${formatNumber(module.total)} in this period`}
                icon={
                  <span className={cn("flex size-8 items-center justify-center rounded-lg", chip)}>
                    <Icon size={16} />
                  </span>
                }
                table={{ columns: [PERIOD_COLUMN[period], "Items"], rows: module.points }}
              >
                <ColumnChart data={module.points} unit="items" width={360} height={180} compact />
              </ChartCard>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Content by academic year"
          description="Courses, assignments, exams and question papers per year."
          table={{ columns: ["Year", "Items"], rows: metrics.byYear }}
        >
          <BarChart data={metrics.byYear} unit="items" />
        </ChartCard>

        <ChartCard
          title="Devices by platform"
          description="Share of registered devices on Android and iOS."
          table={{ columns: ["Platform", "Devices"], rows: metrics.devicesByPlatform }}
        >
          <DonutChart data={metrics.devicesByPlatform} centerLabel="devices" />
        </ChartCard>

        <ChartCard
          title="Devices by user type"
          description="Faculty and student installs on each platform."
          legend={<ChartLegend items={PLATFORM_LEGEND} />}
          table={{ columns: ["Segment", "Devices"], rows: metrics.devicesBySegment }}
          className="lg:col-span-2"
        >
          <BarChart data={metrics.devicesBySegment} unit="devices" />
        </ChartCard>
      </div>
    </ContentContainer>
  );
}
