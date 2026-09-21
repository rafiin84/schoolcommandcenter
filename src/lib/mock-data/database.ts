import {
  STATEWIDE_TOTAL_SCHOOLS,
  STATEWIDE_TOTAL_STUDENTS,
  STATEWIDE_TOTAL_TEACHERS,
  STATEWIDE_TOTAL_ZOHO_ACCOUNTS,
} from "@/lib/constants";
import { generateAiInsights } from "./ai-insight-factory";
import { generateAlerts } from "./alert-factory";
import { generateAnnouncements } from "./announcement-factory";
import { generateLeadershipDirectory } from "./contact-factory";
import { generateGeography, toHierarchyNodes } from "./geography-factory";
import { computeDistrictSnapshots, computeStateSnapshot } from "./kpi-factory";
import { generateModuleUsage } from "./module-usage-factory";
import { generateNotifications } from "./notification-factory";
import { generateZohoAccounts } from "./zoho-factory";

/**
 * The full mock dataset, generated once (module-scope singleton) so every
 * mock service call reads from the same stable, deterministic state for
 * the lifetime of the process. Regenerating would only happen on redeploy.
 */
function buildDatabase() {
  const { districts, blocks, schools } = generateGeography();
  const hierarchyNodes = toHierarchyNodes(districts, blocks, schools);
  const zohoAccounts = generateZohoAccounts(schools).slice(0, STATEWIDE_TOTAL_ZOHO_ACCOUNTS);
  const contacts = generateLeadershipDirectory(districts, blocks, schools);
  const alerts = generateAlerts(districts, blocks, schools, contacts);
  const notifications = generateNotifications(alerts, districts);
  const announcements = generateAnnouncements(districts);
  const moduleUsage = generateModuleUsage();

  const blockDistrictById = new Map(blocks.map((b) => [b.id, b.districtId]));
  const schoolDistrictById = new Map(schools.map((s) => [s.id, s.districtId]));
  const openIssueCountByDistrict = new Map<string, number>();
  let totalOpenIssueCount = 0;
  for (const alert of alerts) {
    if (alert.status === "resolved") continue;
    totalOpenIssueCount += 1;
    const districtId =
      alert.geographyType === "district"
        ? alert.geographyId
        : alert.geographyType === "block"
          ? blockDistrictById.get(alert.geographyId)
          : alert.geographyType === "school"
            ? schoolDistrictById.get(alert.geographyId)
            : undefined;
    if (districtId) {
      openIssueCountByDistrict.set(districtId, (openIssueCountByDistrict.get(districtId) ?? 0) + 1);
    }
  }

  const sampleStateSnapshot = computeStateSnapshot(schools, totalOpenIssueCount);
  const stateSnapshot = {
    ...sampleStateSnapshot,
    totalSchools: STATEWIDE_TOTAL_SCHOOLS,
    schoolsOnboarded: Math.round(
      (sampleStateSnapshot.readinessRate / 100) * STATEWIDE_TOTAL_SCHOOLS,
    ),
    studentAccounts: STATEWIDE_TOTAL_STUDENTS,
    teacherAccounts: STATEWIDE_TOTAL_TEACHERS,
    activeAccounts: Math.round(
      (STATEWIDE_TOTAL_STUDENTS + STATEWIDE_TOTAL_TEACHERS) *
        (sampleStateSnapshot.engagementRate / 100),
    ),
  };
  const districtSnapshots = computeDistrictSnapshots(districts, schools, openIssueCountByDistrict);
  const aiInsights = generateAiInsights(stateSnapshot, districtSnapshots, districts);

  return {
    districts,
    blocks,
    schools,
    hierarchyNodes,
    zohoAccounts,
    contacts,
    alerts,
    notifications,
    announcements,
    moduleUsage,
    stateSnapshot,
    districtSnapshots,
    aiInsights,
  };
}

let cachedDatabase: ReturnType<typeof buildDatabase> | null = null;

export function getDatabase() {
  if (!cachedDatabase) {
    cachedDatabase = buildDatabase();
  }
  return cachedDatabase;
}
