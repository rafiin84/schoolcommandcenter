import type {
  ApiResponse,
  BlockSummary,
  DistrictSummary,
  GeographicHierarchy,
  School,
} from "@/types";
import { getDatabase } from "@/lib/mock-data/database";
import { type MapFiltersInput, mapFiltersSchema } from "@/lib/schemas/filters";
import { MockApiError, simulateNetwork, withEnvelope } from "./helpers";

export async function getDistrictSummaries(): Promise<ApiResponse<DistrictSummary[]>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    return withEnvelope(db.districts, "Illustrative district summaries (mock)");
  });
}

export async function getBlockSummaries(
  districtId: string,
): Promise<ApiResponse<BlockSummary[]>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    const blocks = db.blocks.filter((b) => b.districtId === districtId);
    return withEnvelope(blocks, "Illustrative block summaries (mock)");
  });
}

export interface SchoolDetails {
  school: School;
  district: DistrictSummary;
  block: BlockSummary;
}

export async function getSchoolDetails(
  schoolId: string,
): Promise<ApiResponse<SchoolDetails>> {
  return simulateNetwork(() => {
    const db = getDatabase();
    const school = db.schools.find((s) => s.id === schoolId);
    if (!school) {
      throw new MockApiError(`No school found with id ${schoolId}`, "not_found");
    }
    const district = db.districts.find((d) => d.id === school.districtId)!;
    const block = db.blocks.find((b) => b.id === school.blockId)!;
    return withEnvelope({ school, district, block }, "Illustrative school detail (mock)");
  });
}

export async function getEducationMapData(
  filters: MapFiltersInput = {},
): Promise<ApiResponse<GeographicHierarchy[]>> {
  const parsed = mapFiltersSchema.safeParse(filters);
  if (!parsed.success) {
    throw new MockApiError("Invalid map filter input.", "invalid_input");
  }
  const f = parsed.data;

  return simulateNetwork(() => {
    const db = getDatabase();
    let nodes = db.hierarchyNodes;

    if (f.districtId) {
      nodes = nodes.filter(
        (n) => n.districtId === f.districtId || n.id === f.districtId,
      );
    }
    if (f.blockId) {
      nodes = nodes.filter((n) => n.blockId === f.blockId || n.id === f.blockId);
    }
    if (f.search) {
      const q = f.search.toLowerCase();
      nodes = nodes.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          (n.schoolCode ?? "").toLowerCase().includes(q),
      );
    }
    if (f.onboardingStatus && f.onboardingStatus.length > 0) {
      nodes = nodes.filter((n) => f.onboardingStatus!.includes(n.status));
    }
    if (typeof f.minEngagement === "number") {
      nodes = nodes.filter((n) => n.engagementRate >= f.minEngagement!);
    }
    if (typeof f.maxEngagement === "number") {
      nodes = nodes.filter((n) => n.engagementRate <= f.maxEngagement!);
    }
    if (f.priority && f.priority.length > 0) {
      const geoIds = new Set(
        db.alerts
          .filter((a) => f.priority!.includes(a.priority) && a.status !== "resolved")
          .map((a) => a.geographyId),
      );
      nodes = nodes.filter((n) => geoIds.has(n.id));
    }

    return withEnvelope(nodes, "Illustrative education map dataset (mock)");
  });
}
