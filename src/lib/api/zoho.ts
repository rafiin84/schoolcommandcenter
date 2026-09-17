import type { ApiResponse, ZohoClassesAccount } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import { MockApiError, simulateNetwork, withEnvelope } from "./helpers";

export async function getZohoAccountForSchool(
  schoolId: string,
): Promise<ApiResponse<ZohoClassesAccount | null>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    const school = db.schools.find((s) => s.id === schoolId);
    if (!school) {
      throw new MockApiError(`No school found with id ${schoolId}`, "not_found");
    }
    const account = db.zohoAccounts.find((a) => a.assignedSchoolId === schoolId) ?? null;
    return withEnvelope(account, "Illustrative Zoho Classes mapping (mock)");
  });
}

export async function getZohoAccountDirectory(): Promise<
  ApiResponse<ZohoClassesAccount[]>
> {
  return simulateNetwork(() => {
    const db = getDatabase();
    return withEnvelope(db.zohoAccounts, "Illustrative Zoho Classes directory (mock)");
  });
}
