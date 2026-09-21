import type { ModuleUsageStat } from "@/types";

export function generateModuleUsage(): ModuleUsageStat[] {
  return [
    { id: "feeds", module: "Feeds", count: 1_842_600, helpText: "Class feed posts shared" },
    { id: "assignments", module: "Assignments", count: 934_200, helpText: "Assignments created" },
    { id: "exams", module: "Exams", count: 128_450, helpText: "Exams conducted" },
    { id: "courses", module: "Courses", count: 46_900, helpText: "Courses published" },
    { id: "attendance", module: "Attendance", count: 12_400_000, helpText: "Attendance records logged" },
    { id: "practise-test", module: "Practise Test", count: 612_300, helpText: "Practice test attempts" },
    { id: "question-papers", module: "Question Papers", count: 58_700, helpText: "Question papers uploaded" },
    { id: "syllabus", module: "Syllabus", count: 21_400, helpText: "Syllabus plans tracked" },
  ];
}
