"use client";

import { ContentContainer } from "@/components/layout/content-container";
import { SectionHeader } from "@/components/layout/section-header";
import {
  AcademicList,
  AnnouncementList,
  AttendanceSummary,
  CourseList,
  DevicesDashboard,
  FeedList,
  ReportPanel,
} from "@/components/reports/report-sections";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { useReports } from "@/hooks/use-reports";

export default function ReportsPage() {
  const reports = useReports();

  if (reports.isLoading) {
    return (
      <ContentContainer>
        <ListSkeleton count={6} />
      </ContentContainer>
    );
  }

  if (reports.isError || !reports.data) {
    return (
      <ContentContainer>
        <ErrorState onRetry={() => reports.refetch()} />
      </ContentContainer>
    );
  }

  const data = reports.data.data;

  return (
    <ContentContainer>
      <section className="mb-8">
        <SectionHeader title="Recent activities" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ReportPanel title="Recent Announcements">
            <AnnouncementList items={data.announcements} />
          </ReportPanel>
          <ReportPanel title="Today's Attendance">
            <AttendanceSummary attendance={data.attendance} />
          </ReportPanel>
          <ReportPanel title="Recent Assignments">
            <AcademicList items={data.assignments} />
          </ReportPanel>
          <ReportPanel title="Recently Published Courses">
            <CourseList items={data.courses} />
          </ReportPanel>
          <ReportPanel title="Recent Question Papers">
            <AcademicList items={data.questionPapers} />
          </ReportPanel>
          <ReportPanel title="Recent Exams">
            <AcademicList items={data.exams} />
          </ReportPanel>
          <ReportPanel title="Recent Feeds" className="lg:col-span-2">
            <FeedList items={data.feeds} />
          </ReportPanel>
        </div>
      </section>

      <section>
        <SectionHeader title="Devices Dashboard" />
        <div className="rounded-2xl border border-border bg-card">
          <DevicesDashboard summary={data.deviceSummary} devices={data.devices} />
        </div>
      </section>
    </ContentContainer>
  );
}
