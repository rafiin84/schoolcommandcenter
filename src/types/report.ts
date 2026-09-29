export interface ReportAnnouncement {
  id: string;
  title: string;
  imageUrl: string;
  authorName: string;
  createdAt: string;
}

/** Shared shape for assignments, exams and question papers. */
export interface ReportAcademicItem {
  id: string;
  yearLabel: string;
  subject: string;
  title: string;
  description?: string;
  authorName: string;
  createdAt: string;
}

export interface ReportCourse {
  id: string;
  yearLabel: string;
  subject: string;
  title: string;
  description: string;
  authorName?: string;
  publishedAt?: string;
}

export interface ReportAttendance {
  totalPresent: number;
  absent: number;
  classesTaken: number;
}

export interface ReportFeed {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export type DevicePlatform = "iOS" | "ANDROID";

export type DeviceUserType = "Student" | "Faculty";

export interface ReportDevice {
  id: string;
  name: string;
  platform: DevicePlatform;
  deviceModel: string;
  userType: DeviceUserType;
}

export interface ReportDeviceSummary {
  androidFaculty: number;
  androidStudent: number;
  iosFaculty: number;
  iosStudent: number;
}

export interface ReportsData {
  announcements: ReportAnnouncement[];
  attendance: ReportAttendance;
  assignments: ReportAcademicItem[];
  courses: ReportCourse[];
  questionPapers: ReportAcademicItem[];
  exams: ReportAcademicItem[];
  feeds: ReportFeed[];
  deviceSummary: ReportDeviceSummary;
  devices: ReportDevice[];
}
