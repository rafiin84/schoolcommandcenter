import type {
  AlertException,
  AlertStatus,
  BlockSummary,
  DistrictSummary,
  LeadershipContact,
  School,
} from "@/types";
import { createRng, pickWeighted, randInt, type Rng } from "./prng";

function pickStatus(rng: Rng): AlertStatus {
  return pickWeighted(rng, [
    ["open", 55],
    ["acknowledged", 30],
    ["resolved", 15],
  ]);
}

function dueDateFor(rng: Rng, status: AlertStatus): string | null {
  if (status === "resolved") return null;
  const offsetDays = randInt(rng, -10, 21);
  return new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString();
}

function createdDateFor(rng: Rng): string {
  const daysAgo = randInt(rng, 1, 75);
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
}

interface ContactIndex {
  state: string | null;
  byDistrict: Map<string, string>;
  byBlock: Map<string, string>;
  bySchool: Map<string, string>;
}

function buildContactIndex(contacts: LeadershipContact[]): ContactIndex {
  const byDistrict = new Map<string, string>();
  const byBlock = new Map<string, string>();
  const bySchool = new Map<string, string>();
  let state: string | null = null;

  for (const contact of contacts) {
    if (contact.administrativeLevel === "state" && !state) state = contact.id;
    if (contact.administrativeLevel === "district" && contact.districtId) {
      byDistrict.set(contact.districtId, contact.id);
    }
    if (contact.administrativeLevel === "block" && contact.blockId) {
      byBlock.set(contact.blockId, contact.id);
    }
    if (contact.administrativeLevel === "school" && contact.schoolId) {
      bySchool.set(contact.schoolId, contact.id);
    }
  }

  return { state, byDistrict, byBlock, bySchool };
}

export function generateAlerts(
  districts: DistrictSummary[],
  blocks: BlockSummary[],
  schools: School[],
  contacts: LeadershipContact[],
): AlertException[] {
  const alerts: AlertException[] = [];
  const idx = buildContactIndex(contacts);
  let counter = 0;

  const nextId = () => `alert-${(++counter).toString().padStart(4, "0")}`;

  for (const district of districts) {
    const onboardRate = district.schoolsOnboarded / district.totalSchools;
    if (onboardRate < 0.62) {
      const rng = createRng(`alert-district-deploy:${district.id}`);
      const status = pickStatus(rng);
      alerts.push({
        id: nextId(),
        title: `${district.name} district trailing onboarding target`,
        description: `${district.name} has onboarded ${district.schoolsOnboarded} of ${district.totalSchools} schools (${Math.round(onboardRate * 100)}%), below the illustrative statewide target of 90%.`,
        geographyType: "district",
        geographyId: district.id,
        priority: onboardRate < 0.45 ? "critical" : onboardRate < 0.55 ? "high" : "medium",
        status,
        category: "deployment",
        metricName: "Schools Onboarded (%)",
        currentValue: Math.round(onboardRate * 100),
        targetValue: 90,
        createdAt: createdDateFor(rng),
        dueAt: dueDateFor(rng, status),
        responsibleContactId: idx.byDistrict.get(district.id) ?? idx.state,
        recommendedAction:
          "Review block-level readiness data and coordinate a district onboarding sprint with block education officers.",
        supportingKpiIds: [`kpi-district-${district.id}`, "kpi-state-tamil-nadu"],
      });
    }

    if (district.engagementRate < 50) {
      const rng = createRng(`alert-district-engagement:${district.id}`);
      const status = pickStatus(rng);
      alerts.push({
        id: nextId(),
        title: `Engagement softening across ${district.name}`,
        description: `Average engagement rate across onboarded schools in ${district.name} is ${district.engagementRate}%, below the illustrative target of 75%.`,
        geographyType: "district",
        geographyId: district.id,
        priority: district.engagementRate < 35 ? "high" : "medium",
        status,
        category: "engagement",
        metricName: "Engagement Rate (%)",
        currentValue: district.engagementRate,
        targetValue: 75,
        createdAt: createdDateFor(rng),
        dueAt: dueDateFor(rng, status),
        responsibleContactId: idx.byDistrict.get(district.id) ?? idx.state,
        recommendedAction:
          "Review block-level usage patterns and coordinate refresher orientation sessions with school heads.",
        supportingKpiIds: [`kpi-district-${district.id}`],
      });
    }
  }

  for (const block of blocks) {
    const onboardRate = block.schoolsOnboarded / block.totalSchools;
    const rng = createRng(`alert-block:${block.id}`);
    if (onboardRate < 0.5 && rng() < 0.7) {
      const status = pickStatus(rng);
      alerts.push({
        id: nextId(),
        title: `${block.name} block below onboarding target`,
        description: `${block.name} has onboarded ${block.schoolsOnboarded} of ${block.totalSchools} schools (${Math.round(onboardRate * 100)}%), well below the illustrative 90% target.`,
        geographyType: "block",
        geographyId: block.id,
        priority: onboardRate < 0.3 ? "critical" : "high",
        status,
        category: "deployment",
        metricName: "Schools Onboarded (%)",
        currentValue: Math.round(onboardRate * 100),
        targetValue: 90,
        createdAt: createdDateFor(rng),
        dueAt: dueDateFor(rng, status),
        responsibleContactId: idx.byBlock.get(block.id) ?? idx.byDistrict.get(block.districtId) ?? idx.state,
        recommendedAction:
          "Contact the block education officer to identify onboarding blockers at the remaining schools.",
        supportingKpiIds: [`kpi-district-${block.districtId}`],
      });
    }
  }

  for (const school of schools) {
    if (school.operationalHealth === "critical") {
      const rng = createRng(`alert-school-op:${school.id}`);
      const status = pickStatus(rng);
      alerts.push({
        id: nextId(),
        title: `Operational health critical at ${school.name}`,
        description: `${school.name} (${school.schoolCode}) shows low engagement (${school.engagementRate}%) alongside signs of platform inactivity since ${new Date(school.lastActivityAt).toLocaleDateString("en-IN")}.`,
        geographyType: "school",
        geographyId: school.id,
        priority: school.engagementRate < 25 ? "critical" : "high",
        status,
        category: "operational",
        metricName: "Operational Health Score",
        currentValue: school.engagementRate,
        targetValue: 80,
        createdAt: createdDateFor(rng),
        dueAt: dueDateFor(rng, status),
        responsibleContactId:
          idx.bySchool.get(school.id) ?? idx.byBlock.get(school.blockId) ?? idx.byDistrict.get(school.districtId) ?? idx.state,
        recommendedAction:
          "Reach out to the head of school to confirm device availability and re-verify the Zoho Classes account status.",
        supportingKpiIds: [`kpi-district-${school.districtId}`],
      });
      school.alertIds.push(alerts[alerts.length - 1].id);
    } else if (school.onboardingStatus === "at_risk") {
      const rng = createRng(`alert-school-deploy:${school.id}`);
      if (rng() < 0.55) {
        const status = pickStatus(rng);
        alerts.push({
          id: nextId(),
          title: `Onboarding stalled at ${school.name}`,
          description: `${school.name} (${school.schoolCode}) has created accounts for only ${school.studentAccountsCreated} of ${school.studentCount} students.`,
          geographyType: "school",
          geographyId: school.id,
          priority: "medium",
          status,
          category: "deployment",
          metricName: "Student Accounts Created (%)",
          currentValue: Math.round((school.studentAccountsCreated / school.studentCount) * 100),
          targetValue: 90,
          createdAt: createdDateFor(rng),
          dueAt: dueDateFor(rng, status),
          responsibleContactId:
            idx.bySchool.get(school.id) ?? idx.byBlock.get(school.blockId) ?? idx.byDistrict.get(school.districtId) ?? idx.state,
          recommendedAction:
            "Coordinate with the correspondent to complete the remaining student account creation before the term milestone.",
          supportingKpiIds: [`kpi-district-${school.districtId}`],
        });
        school.alertIds.push(alerts[alerts.length - 1].id);
      }
    }
  }

  const supportDistricts = districts.slice(0, 14);
  for (const district of supportDistricts) {
    const rng = createRng(`alert-support:${district.id}`);
    if (rng() < 0.45) {
      const status = pickStatus(rng);
      const openTickets = randInt(rng, 6, 42);
      alerts.push({
        id: nextId(),
        title: `Helpdesk ticket backlog rising in ${district.name}`,
        description: `${openTickets} unresolved Zoho Classes support tickets are illustratively logged for ${district.name}, above the comfortable working threshold.`,
        geographyType: "district",
        geographyId: district.id,
        priority: openTickets > 30 ? "high" : "medium",
        status,
        category: "support",
        metricName: "Open Support Tickets",
        currentValue: openTickets,
        targetValue: 10,
        createdAt: createdDateFor(rng),
        dueAt: dueDateFor(rng, status),
        responsibleContactId: idx.byDistrict.get(district.id) ?? idx.state,
        recommendedAction:
          "Escalate to the district helpdesk coordinator and review staffing against ticket volume.",
        supportingKpiIds: [`kpi-district-${district.id}`],
      });
    }
  }

  return alerts;
}
