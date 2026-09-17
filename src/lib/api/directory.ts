import type { ApiResponse, LeadershipContact } from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import {
  type DirectoryFiltersInput,
  directoryFiltersSchema,
} from "@/lib/schemas/filters";
import { MockApiError, simulateNetwork, withEnvelope } from "./helpers";

export async function getLeadershipDirectory(
  filters: DirectoryFiltersInput = {},
): Promise<ApiResponse<LeadershipContact[]>> {
  const parsed = directoryFiltersSchema.safeParse(filters);
  if (!parsed.success) {
    throw new MockApiError("Invalid directory filter input.", "invalid_input");
  }
  const f = parsed.data;

  return simulateNetwork(() => {
    const db = getDatabase();
    let contacts = [...db.contacts];

    if (f.search) {
      const q = f.search.toLowerCase();
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.responsibility.toLowerCase().includes(q),
      );
    }
    if (f.administrativeLevel && f.administrativeLevel.length > 0) {
      contacts = contacts.filter((c) => f.administrativeLevel!.includes(c.administrativeLevel));
    }
    if (f.districtId) {
      contacts = contacts.filter((c) => c.districtId === f.districtId);
    }
    if (f.blockId) {
      contacts = contacts.filter((c) => c.blockId === f.blockId);
    }

    return withEnvelope(contacts, "Illustrative leadership directory (mock)");
  });
}
