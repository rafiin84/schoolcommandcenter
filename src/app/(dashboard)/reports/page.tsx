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

const PLATFORM_LEGEND = [
  { label: "Android", color: PLATFORM_COLOR.Android },
  { label: "iOS", color: PLATFORM_COLOR.iOS },
];

// Same icon + tone per module as the count tiles above.
// Each module keeps one hue across its tile, icon chip and chart. Status red is
// reserved for alerts, so exams use pink rather than red.
const MODULE_ORDER: ReportModuleKey[] = ["announcements", "courses", "assignments", "exams", "questionPapers", "feeds"];

const MODULE_COLOR: Record<ReportModuleKey, string> = {
  announcements: "var(--primary)",
  courses: "var(--primary)",
  assignments: "var(--primary)",
  exams: "var(--primary)",
  questionPapers: "var(--primary)",
  feeds: "var(--primary)",
};

// The combined series isn't any one module, so it wears the neutral ink.
const ALL_MODULES_COLOR = "var(--primary)";

// Academic years are ordered, so they get one hue stepping darker per year
// instead of borrowing a module's colour.
function yearRamp(index: number, count: number): string {
  const strength = count <= 1 ? 100 : 40 + (60 * index) / (count - 1);
  return `color-mix(in oklab, var(--primary) ${Math.round(strength)}%, var(--card))`;
}

const PERIOD_COLUMN: Record<ReportPeriod, string> = { week: "Week", month: "Month", year: "Year" };

function PeriodSelect({ value, onChange }: { value: ReportPeriod; onChange: (period: ReportPeriod) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ReportPeriod)}
      aria-label="Report period"
      className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {PERIOD_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type ReportData = NonNullable<ReturnType<typeof useReports>["data"]>["data"];

// Each card owns its period, like the Zoho Classes dashboard cards.
function TrendCard({ data, moduleKey }: { data: ReportData; moduleKey: ReportModuleKey | "all" }) {
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const trends = useMemo(() => buildModuleTrends(data, period), [data, period]);
  const item = moduleKey === "all" ? null : trends.modules.find((m) => m.key === moduleKey);
  const points = item ? item.points : trends.combined;
  const total = item ? item.total : trends.combined.reduce((sum, p) => sum + p.value, 0);
  const label = item ? item.label : "All modules";

  return (
    <ChartCard
      title={label}
      value={formatNumber(total)}
      description={item ? `${label} in ${trends.rangeLabel}` : `Items published, ${trends.rangeLabel}`}
      action={<PeriodSelect value={period} onChange={setPeriod} />}
      table={{ columns: [PERIOD_COLUMN[period], "Items"], rows: points }}
      className={item ? undefined : "lg:col-span-2"}
    >
      {item ? (
        <ColumnChart data={points} color={MODULE_COLOR[item.key]} unit="items" width={520} height={240} compact />
      ) : (
        <AreaChart data={points} color={ALL_MODULES_COLOR} unit="items" />
      )}
    </ChartCard>
  );
}

export default function ReportsPage() {
  const reports = useReports();
  const data = reports.data?.data;
  const metrics = useMemo(() => (data ? buildReportMetrics(data) : null), [data]);

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

  if (reports.isError || !data || !metrics) {
    return (
      <ContentContainer>
        <ErrorState onRetry={() => reports.refetch()} />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Reports Dashboard</h1>
      <section aria-label="Feature counts" className="mb-8">
        <KpiGrid
          cards={[
            { label: "Announcements", value: formatNumber(data.announcements.length), helpText: "Announcements posted", icon: Megaphone, tone: "navy" },
            { label: "Courses", value: formatNumber(data.courses.length), helpText: "Courses published", icon: BookOpen, tone: "green" },
            { label: "Assignments", value: formatNumber(data.assignments.length), helpText: "Assignments created", icon: ClipboardText, tone: "orange" },
            { label: "Exams", value: formatNumber(data.exams.length), helpText: "Exams conducted", icon: Certificate, tone: "pink" },
            { label: "Question papers", value: formatNumber(data.questionPapers.length), helpText: "Question papers uploaded", icon: FilePdf, tone: "amber" },
            { label: "Feeds", value: formatNumber(data.feeds.length), helpText: "Class feed posts", icon: ChatCircleText, tone: "blue" },
            {
              label: "Present today",
              value: formatNumber(data.attendance.totalPresent),
              helpText: `${data.attendance.absent} absent · ${data.attendance.classesTaken} classes taken`,
              icon: UsersThree,
              tone: "teal",
            },
            { label: "Registered devices", value: formatNumber(metrics.totalDevices), helpText: "Android and iOS installs", icon: DeviceMobile, tone: "navy" },
          ]}
        />
      </section>

      <section aria-label="Content over time" className="mb-6">
        <SectionHeader title="Content statistics" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrendCard data={data} moduleKey="all" />
          {MODULE_ORDER.map((key) => (
            <TrendCard key={key} data={data} moduleKey={key} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Content by academic year"
          description="Courses, assignments, exams and question papers per year."
          table={{ columns: ["Year", "Items"], rows: metrics.byYear }}
        >
          <BarChart
            data={metrics.byYear.map((d, i, all) => ({ ...d, color: yearRamp(i, all.length) }))}
            unit="items"
          />
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
