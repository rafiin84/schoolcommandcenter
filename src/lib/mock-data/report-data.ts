import type { ReportAcademicItem, ReportsData } from "@/types";

// Static sample data mirroring the institution activity report (BDS college),
// so the Reports page shows the same entries as the reference screenshots.

const ORAL_PATHOLOGY = "Oral Pathology and Oral Microbiology";
const PEDIATRIC = "Pediatric and Preventive Dentistry";

const assignments: ReportAcademicItem[] = [
  {
    id: "asg-1",
    yearLabel: "BDS 3rd Year",
    subject: ORAL_PATHOLOGY,
    title: "MINDMAP FOR CANDIDIASIS",
    description: "MINDMAP FOR CANDIDIASIS",
    authorName: "Dr. Premika Sri .V.L",
    createdAt: "2026-03-16T16:00:00+05:30",
  },
  {
    id: "asg-2",
    yearLabel: "BDS 3rd Year",
    subject: ORAL_PATHOLOGY,
    title: "RESEARCH ON RECENT EMERGING BACTERIAL INFECTIONS",
    description: "RESEARCH ON RECENT EMERGING BACTERIAL INFECTIONS - JAPANESE ENCEPHALITIS",
    authorName: "Sreeja Sreeja",
    createdAt: "2026-02-23T15:00:00+05:30",
  },
];

const questionPapers: ReportAcademicItem[] = [
  {
    id: "qp-1",
    yearLabel: "BDS 4th Year",
    subject: PEDIATRIC,
    title: "Plaque control measures",
    authorName: "Dr Shruthi.M",
    createdAt: "2026-09-24T09:15:00+05:30",
  },
  {
    id: "qp-2",
    yearLabel: "BDS 4th Year",
    subject: PEDIATRIC,
    title: "Pit and Fissure Sealants",
    authorName: "Mercy Vinolia T",
    createdAt: "2026-09-15T12:34:00+05:30",
  },
  {
    id: "qp-3",
    yearLabel: "BDS 4th Year",
    subject: PEDIATRIC,
    title: "NON-PHARMACOLOGICAL BEHAVIOUR MANAGEMENT",
    authorName: "Dr Nancy S",
    createdAt: "2026-09-15T12:31:00+05:30",
  },
];

const exams: ReportAcademicItem[] = [
  {
    id: "exam-1",
    yearLabel: "BDS 3rd Year",
    subject: ORAL_PATHOLOGY,
    title: "NON NEOPLASTIC SALIVARY GLAND DISEASES",
    description: "MCQ",
    authorName: "Dr.Nachiammai N",
    createdAt: "2026-05-11T16:08:00+05:30",
  },
  {
    id: "exam-2",
    yearLabel: "BDS 1st Year",
    subject: ORAL_PATHOLOGY,
    title: "MAXILLARY SECOND PREMOLAR",
    description: "Answer all the MCQs",
    authorName: "Dr.Bhuvaneswari Mahalingam",
    createdAt: "2026-02-25T08:28:00+05:30",
  },
  {
    id: "exam-3",
    yearLabel: "BDS 1st Year",
    subject: ORAL_PATHOLOGY,
    title: "MAXILLARY FIRST PREMOLAR",
    description: "Answer all the MCQs",
    authorName: "Dr.Bhuvaneswari Mahalingam",
    createdAt: "2026-02-25T08:27:00+05:30",
  },
];

export const REPORTS_DATA: ReportsData = {
  announcements: [
    {
      id: "ann-1",
      title:
        "Join us for CARE 2025 – Paediatrics PG Refresher (Hybrid) on July 1 at TNMC! Topics: CP, Short Stature, DS, ILD, Nephrotic…",
      imageUrl: "/reports/care-2025.jpg",
      authorName: "Care Admin",
      createdAt: "2025-06-18T15:25:00+05:30",
    },
    {
      id: "ann-2",
      title:
        "Surgery Workshop on Wheels June 18 | For PGs Hands-on training in laparoscopy & suturing 10 endotrainers • 18 stations With…",
      imageUrl: "/reports/surgery-workshop.jpg",
      authorName: "Care Admin",
      createdAt: "2025-06-18T15:23:00+05:30",
    },
    {
      id: "ann-3",
      title:
        "Join us on June 21 for a Virtual Seminar on “Yoga for Wellness – Body, Mind & Soul” | 12–1:30 PM | E-Certificate | Register:…",
      imageUrl: "/reports/yoga-seminar.jpg",
      authorName: "Care Admin",
      createdAt: "2025-06-18T15:23:00+05:30",
    },
  ],
  attendance: { totalPresent: 0, absent: 0, classesTaken: 0 },
  assignments,
  courses: [
    {
      id: "course-1",
      yearLabel: "BDS 4th Year",
      subject: PEDIATRIC,
      title: "Plaque Control",
      description: "This course explains various plaque control measures, and age-based…",
      tone: "green",
      authorName: "Dr Shruthi.M",
      publishedAt: "2026-09-24T08:50:00+05:30",
    },
    {
      id: "course-2",
      yearLabel: "BDS 2nd Year",
      subject: "Dental Materials",
      title: "INTRODUCTION TO DENTAL MATERIALS",
      description: "INTRODUCTION TO DENTAL MATERIALS",
      tone: "purple",
      authorName: "DR.SRIDHARAN DR.SRIDHARAN",
      publishedAt: "2026-09-15T11:18:00+05:30",
    },
    {
      id: "course-3",
      yearLabel: "BDS 4th Year",
      subject: PEDIATRIC,
      title: "Fear And Anxiety",
      description: "This course explains definitions, differences between fear and anxiety,…",
      tone: "green",
    },
  ],
  questionPapers,
  exams,
  feeds: [],
  deviceSummary: {
    androidFaculty: 10,
    androidStudent: 278,
    iosFaculty: 8,
    iosStudent: 627,
  },
  devices: [
    { id: "dev-1", name: "Lahari S B", platform: "iOS", deviceModel: "iPad15,7", userType: "Student" },
    { id: "dev-2", name: "Sujitha D", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
    { id: "dev-3", name: "Sujitha D", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
    { id: "dev-4", name: "Sujitha D", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
    { id: "dev-5", name: "Sujitha D", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
    { id: "dev-6", name: "Arunachalam A", platform: "ANDROID", deviceModel: "Xiaomi 2109119DI", userType: "Student" },
    { id: "dev-7", name: "Lahari S B", platform: "iOS", deviceModel: "iPad15,7", userType: "Student" },
    { id: "dev-8", name: "sanjay Kumar R", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
    { id: "dev-9", name: "Malini R", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
    { id: "dev-10", name: "Asheka S", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
    { id: "dev-11", name: "Keerthana .P", platform: "iOS", deviceModel: "iPad (10th generation)", userType: "Student" },
  ],
};
