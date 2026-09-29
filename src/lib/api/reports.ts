import type { ApiResponse, ReportsData } from "@/types";
import { REPORTS_DATA } from "@/lib/mock-data/report-data";
import { simulateNetwork, withEnvelope } from "./helpers";

export async function getReports(): Promise<ApiResponse<ReportsData>> {
  return simulateNetwork(() => withEnvelope(REPORTS_DATA, "Institution activity report (mock)"));
}
