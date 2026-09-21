import type { ApiResponse, Announcement } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import { simulateNetwork, withEnvelope } from "./helpers";

export async function getAnnouncements(): Promise<ApiResponse<Announcement[]>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    return withEnvelope(db.announcements, "Illustrative announcements feed (mock)");
  });
}
