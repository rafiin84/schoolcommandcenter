import type { ReportsData } from "@/types";

export interface ChartDatum {
  label: string;
  /** Compact axis label; the full `label` is used in tooltips and tables. */
  shortLabel?: string;
  value: number;
  color?: string;
}

// Devices are coloured by platform everywhere on the page, so the donut and the
// bar chart agree on which hue means Android and which means iOS.
export const PLATFORM_COLOR = {
  Android: "var(--chart-3)",
  iOS: "var(--chart-1)",
} as const;

export type ReportPeriod = "week" | "month" | "year";

export const PERIOD_OPTIONS: { value: ReportPeriod; label: string }[] = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
];

export type ReportModuleKey = "announcements" | "courses" | "assignments" | "exams" | "questionPapers" | "feeds";

export const MODULE_LABEL: Record<ReportModuleKey, string> = {
  announcements: "Announcements",
  courses: "Courses",
  assignments: "Assignments",
  exams: "Exams",
  questionPapers: "Question papers",
  feeds: "Feeds",
};

const RECENT_BUCKETS = 12;
const MIN_YEARS = 3;

function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // weeks start on Monday
  return d;
}

function bucketStart(period: ReportPeriod, date: Date): Date {
  if (period === "week") return startOfWeek(date);
  if (period === "month") return new Date(date.getFullYear(), date.getMonth(), 1);
  return new Date(date.getFullYear(), 0, 1);
}

function bucketLabels(period: ReportPeriod, start: Date): { label: string; shortLabel: string } {
  if (period === "week") {
    const short = start.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return { label: `Week of ${start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`, shortLabel: short };
  }
  if (period === "month") {
    return {
      label: start.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      shortLabel: start.toLocaleDateString("en-IN", { month: "short" }),
    };
  }
  const year = String(start.getFullYear());
  return { label: year, shortLabel: year };
}

/**
 * The time buckets shared by every module chart, ending at the newest item so all
 * charts line up on the same x-axis: the last 12 weeks / months, or every year
 * from the oldest item (at least three years).
 */
function timeBuckets(period: ReportPeriod, allDates: Date[]): Date[] {
  if (allDates.length === 0) return [];
  const newest = new Date(Math.max(...allDates.map((d) => d.getTime())));
  const last = bucketStart(period, newest);

  if (period === "year") {
    const oldestYear = Math.min(...allDates.map((d) => d.getFullYear()));
    const firstYear = Math.min(oldestYear, last.getFullYear() - (MIN_YEARS - 1));
    return Array.from({ length: last.getFullYear() - firstYear + 1 }, (_, i) => new Date(firstYear + i, 0, 1));
  }

  return Array.from({ length: RECENT_BUCKETS }, (_, i) => {
    const offset = RECENT_BUCKETS - 1 - i;
    return period === "week"
      ? new Date(last.getFullYear(), last.getMonth(), last.getDate() - offset * 7)
      : new Date(last.getFullYear(), last.getMonth() - offset, 1);
  });
}

function countByBucket(period: ReportPeriod, buckets: Date[], dates: Date[]): ChartDatum[] {
  const counts = new Map<number, number>();
  for (const date of dates) {
    const key = bucketStart(period, date).getTime();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return buckets.map((start) => ({ ...bucketLabels(period, start), value: counts.get(start.getTime()) ?? 0 }));
}

export function periodRangeLabel(period: ReportPeriod, buckets: ChartDatum[]): string {
  if (period === "week") return "last 12 weeks";
  if (period === "month") return "last 12 months";
  return buckets.length > 0 ? `${buckets[0].label}–${buckets[buckets.length - 1].label}` : "all years";
}

function moduleDates(data: ReportsData): Record<ReportModuleKey, Date[]> {
  const toDates = (isos: (string | undefined)[]) => isos.flatMap((iso) => (iso ? [new Date(iso)] : []));
  return {
    announcements: toDates(data.announcements.map((a) => a.createdAt)),
    // A course without a publish date can't be placed on the timeline.
    courses: toDates(data.courses.map((c) => c.publishedAt)),
    assignments: toDates(data.assignments.map((a) => a.createdAt)),
    exams: toDates(data.exams.map((e) => e.createdAt)),
    questionPapers: toDates(data.questionPapers.map((q) => q.createdAt)),
    feeds: toDates(data.feeds.map((f) => f.createdAt)),
  };
}

/** Per-module item counts over time, all on the same buckets for the chosen period. */
export function buildModuleTrends(data: ReportsData, period: ReportPeriod) {
  const byModule = moduleDates(data);
  const buckets = timeBuckets(period, Object.values(byModule).flat());
  const modules = (Object.keys(MODULE_LABEL) as ReportModuleKey[]).map((key) => {
    const points = countByBucket(period, buckets, byModule[key]);
    return { key, label: MODULE_LABEL[key], points, total: points.reduce((sum, p) => sum + p.value, 0) };
  });
  const combined: ChartDatum[] = buckets.map((_, i) => ({
    ...modules[0].points[i],
    value: modules.reduce((sum, m) => sum + m.points[i].value, 0),
  }));
  return { modules, combined, rangeLabel: periodRangeLabel(period, combined) };
}

export function buildReportMetrics(data: ReportsData) {
  const { deviceSummary: devices } = data;

  const academicItems = [...data.courses, ...data.assignments, ...data.exams, ...data.questionPapers];
  const yearCounts = new Map<string, number>();
  for (const item of academicItems) yearCounts.set(item.yearLabel, (yearCounts.get(item.yearLabel) ?? 0) + 1);
  const byYear: ChartDatum[] = [...yearCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([label, value]) => ({ label, value }));

  const devicesByPlatform: ChartDatum[] = [
    { label: "Android", value: devices.androidFaculty + devices.androidStudent, color: PLATFORM_COLOR.Android },
    { label: "iOS", value: devices.iosFaculty + devices.iosStudent, color: PLATFORM_COLOR.iOS },
  ];

  const devicesBySegment: ChartDatum[] = [
    { label: "Android faculty", value: devices.androidFaculty, color: PLATFORM_COLOR.Android },
    { label: "Android students", value: devices.androidStudent, color: PLATFORM_COLOR.Android },
    { label: "iOS faculty", value: devices.iosFaculty, color: PLATFORM_COLOR.iOS },
    { label: "iOS students", value: devices.iosStudent, color: PLATFORM_COLOR.iOS },
  ];

  return {
    byYear,
    devicesByPlatform,
    devicesBySegment,
    totalDevices: devicesByPlatform.reduce((sum, d) => sum + d.value, 0),
  };
}
