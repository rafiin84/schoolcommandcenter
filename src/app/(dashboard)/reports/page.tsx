"use client";

import {
  AndroidLogo,
  AppleLogo,
  BookOpen,
  CalendarCheck,
  CalendarX,
  Certificate,
  ChatCircleText,
  ClipboardText,
  FilePdf,
  Megaphone,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { SectionHeader } from "@/components/layout/section-header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import {
  AcademicList,
  AnnouncementList,
  CourseList,
  DeviceTable,
  FeedList,
  ReportPanel,
} from "@/components/reports/report-sections";
import { ErrorState } from "@/components/shared/error-state";
import { KpiGridSkeleton, ListSkeleton } from "@/components/shared/skeletons";
import { useReports } from "@/hooks/use-reports";
import { formatNumber } from "@/lib/formatters";

export default function ReportsPage() {
  const reports = useReports();

  if (reports.isLoading) {
    return (
      <ContentContainer className="space-y-8">
        <KpiGridSkeleton count={3} />
        <ListSkeleton count={4} />
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
  const { deviceSummary: devices } = data;

  return (
    <ContentContainer>
      <section className="mb-8">
        <SectionHeader title="Today's attendance" description="Live attendance captured across classes today." />
        <KpiGrid
          cards={[
            {
              label: "Total present today",
              value: formatNumber(data.attendance.totalPresent),
              helpText: "Students marked present",
              icon: UsersThree,
              tone: "green",
            },
            {
              label: "Absent",
              value: formatNumber(data.attendance.absent),
              helpText: "Students marked absent",
              icon: CalendarX,
              tone: "red",
            },
            {
              label: "Classes taken",
              value: formatNumber(data.attendance.classesTaken),
              helpText: "Sessions with attendance recorded",
              icon: CalendarCheck,
              tone: "amber",
            },
          ]}
        />
      </section>

      <section className="mb-8">
        <SectionHeader
          title="Recent activities"
          description="Latest content published across Zoho Classes modules."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ReportPanel title="Announcements" icon={Megaphone} tone="navy" count={data.announcements.length}>
            <AnnouncementList items={data.announcements} tone="navy" />
          </ReportPanel>
          <ReportPanel title="Courses" icon={BookOpen} tone="green" count={data.courses.length}>
            <CourseList items={data.courses} tone="green" />
          </ReportPanel>
          <ReportPanel title="Assignments" icon={ClipboardText} tone="orange" count={data.assignments.length}>
            <AcademicList items={data.assignments} tone="orange" />
          </ReportPanel>
          <ReportPanel title="Exams" icon={Certificate} tone="red" count={data.exams.length}>
            <AcademicList items={data.exams} tone="red" />
          </ReportPanel>
          <ReportPanel title="Question papers" icon={FilePdf} tone="teal" count={data.questionPapers.length}>
            <AcademicList items={data.questionPapers} tone="teal" />
          </ReportPanel>
          <ReportPanel title="Feeds" icon={ChatCircleText} tone="blue" count={data.feeds.length}>
            <FeedList items={data.feeds} tone="blue" />
          </ReportPanel>
        </div>
      </section>

      <section>
        <SectionHeader title="Devices dashboard" description="Zoho Classes app installs by platform and user type." />
        <div className="mb-4">
          <KpiGrid
            cards={[
              {
                label: "Android faculty",
                value: formatNumber(devices.androidFaculty),
                helpText: "Faculty on Android",
                icon: AndroidLogo,
                tone: "teal",
              },
              {
                label: "Android students",
                value: formatNumber(devices.androidStudent),
                helpText: "Students on Android",
                icon: AndroidLogo,
                tone: "green",
              },
              {
                label: "iOS faculty",
                value: formatNumber(devices.iosFaculty),
                helpText: "Faculty on iPhone / iPad",
                icon: AppleLogo,
                tone: "navy",
              },
              {
                label: "iOS students",
                value: formatNumber(devices.iosStudent),
                helpText: "Students on iPhone / iPad",
                icon: AppleLogo,
                tone: "blue",
              },
            ]}
          />
        </div>
        <DeviceTable devices={data.devices} />
      </section>
    </ContentContainer>
  );
}
