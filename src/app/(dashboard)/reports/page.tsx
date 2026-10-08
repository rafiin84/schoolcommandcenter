"use client";

import { useMemo } from "react";
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
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ReportCharts } from "@/components/reports/report-charts-section";
import { buildReportMetrics } from "@/components/reports/report-metrics";
import { ErrorState } from "@/components/shared/error-state";
import { ChartSkeleton, KpiGridSkeleton } from "@/components/shared/skeletons";
import { useReports } from "@/hooks/use-reports";
import { formatNumber } from "@/lib/formatters";

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

      <ReportCharts data={data} metrics={metrics} />
    </ContentContainer>
  );
}
