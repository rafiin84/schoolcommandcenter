import type { ApiResponse, ModuleUsageStat } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import { simulateNetwork, withEnvelope } from "./helpers";

export async function getModuleUsage(): Promise<ApiResponse<ModuleUsageStat[]>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    return withEnvelope(db.moduleUsage, "Illustrative Zoho Classes module activity (mock)");
  });
}
