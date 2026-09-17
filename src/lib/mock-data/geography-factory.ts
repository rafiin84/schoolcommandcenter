import type {
  BlockSummary,
  DistrictSummary,
  GeographicHierarchy,
  OnboardingStatus,
  OperationalHealth,
  School,
} from "@/types";
import { DISTRICT_SEEDS } from "./districts";
import {
  BLOCK_MODIFIERS,
  SCHOOL_TYPE_TEMPLATES,
  VILLAGE_FRAGMENTS,
} from "./names";
import { clamp, createRng, pick, randFloat, randInt, type Rng } from "./prng";

function deriveOnboardingStatus(progress: number): OnboardingStatus {
  if (progress >= 82) return "onboarded";
  if (progress >= 50) return "in_progress";
  if (progress >= 22) return "at_risk";
  return "not_started";
}

function deriveOperationalHealth(
  engagementRate: number,
  operationalJitter: number,
): OperationalHealth {
  const score = engagementRate * 0.7 + operationalJitter * 0.3;
  if (score >= 60) return "good";
  if (score >= 38) return "watch";
  return "critical";
}

function jitterAround(rng: Rng, baseline: number, spread: number): number {
  return clamp(randFloat(rng, baseline - spread, baseline + spread, 1), 2, 99.5);
}

interface GeneratedGeography {
  districts: DistrictSummary[];
  blocks: BlockSummary[];
  schools: School[];
}

export function generateGeography(): GeneratedGeography {
  const districts: DistrictSummary[] = [];
  const blocks: BlockSummary[] = [];
  const schools: School[] = [];

  let schoolCodeCounter = 100000;

  for (const seed of DISTRICT_SEEDS) {
    const districtRng = createRng(`district:${seed.id}`);
    const districtBaselineOnboarding = randFloat(districtRng, 66, 99, 1);
    const districtBaselineEngagement = randFloat(districtRng, 52, 96, 1);
    const districtBaselineOperational = randFloat(districtRng, 55, 97, 1);

    const blockCount = randInt(districtRng, 3, 5);
    const usedVillageNames = new Set<string>();

    const districtBlocks: BlockSummary[] = [];
    const districtSchools: School[] = [];

    for (let b = 0; b < blockCount; b++) {
      const modifier = BLOCK_MODIFIERS[b % BLOCK_MODIFIERS.length];
      const blockId = `${seed.id}-block-${b + 1}`;
      const blockRng = createRng(`block:${blockId}`);
      const blockName = `${seed.name} ${modifier}`;

      const blockOnboardingBaseline = jitterAround(
        blockRng,
        districtBaselineOnboarding,
        10,
      );
      const blockEngagementBaseline = jitterAround(
        blockRng,
        districtBaselineEngagement,
        10,
      );
      const blockOperationalBaseline = jitterAround(
        blockRng,
        districtBaselineOperational,
        10,
      );

      const schoolCount = randInt(blockRng, 4, 7);
      const blockSchools: School[] = [];

      for (let s = 0; s < schoolCount; s++) {
        let village = pick(blockRng, VILLAGE_FRAGMENTS);
        let attempts = 0;
        while (usedVillageNames.has(`${village}-${s}`) && attempts < 5) {
          village = pick(blockRng, VILLAGE_FRAGMENTS);
          attempts++;
        }
        usedVillageNames.add(`${village}-${s}`);

        const template = pick(blockRng, SCHOOL_TYPE_TEMPLATES);
        const schoolId = `${blockId}-school-${s + 1}`;
        const schoolRng = createRng(`school:${schoolId}`);

        const onboardingProgress = clamp(
          Math.round(jitterAround(schoolRng, blockOnboardingBaseline, 8)),
          0,
          100,
        );
        const engagementRate = clamp(
          Math.round(jitterAround(schoolRng, blockEngagementBaseline, 9)),
          0,
          100,
        );
        const operationalJitter = jitterAround(
          schoolRng,
          blockOperationalBaseline,
          9,
        );

        const studentCount = randInt(schoolRng, 120, 1350);
        const teacherCount = Math.max(4, Math.round(studentCount / randInt(schoolRng, 22, 32)));
        const accountFillRate = clamp(onboardingProgress / 100 + randFloat(schoolRng, -0.05, 0.05, 2), 0, 1);
        const studentAccountsCreated = Math.round(studentCount * accountFillRate);
        const teacherAccountsCreated = Math.round(
          teacherCount * clamp(accountFillRate + 0.1, 0, 1),
        );

        const onboardingStatus = deriveOnboardingStatus(onboardingProgress);
        const operationalHealth = deriveOperationalHealth(engagementRate, operationalJitter);

        const daysAgo = randInt(schoolRng, 0, 21);
        const lastActivityAt = new Date(
          Date.now() - daysAgo * 24 * 60 * 60 * 1000 - randInt(schoolRng, 0, 86400000),
        ).toISOString();

        const latitude = seed.latitude + randFloat(schoolRng, -0.28, 0.28, 3);
        const longitude = seed.longitude + randFloat(schoolRng, -0.28, 0.28, 3);

        schoolCodeCounter += randInt(schoolRng, 3, 11);
        const schoolCode = `TN${schoolCodeCounter}`;

        const zohoAccountId =
          onboardingStatus === "not_started" ? null : `zoho-${schoolId}`;

        const school: School = {
          id: schoolId,
          name: template(village),
          schoolCode,
          districtId: seed.id,
          blockId,
          address: `${village}, ${blockName}, ${seed.name} District`,
          latitude,
          longitude,
          studentCount,
          teacherCount,
          studentAccountsCreated,
          teacherAccountsCreated,
          onboardingStatus,
          engagementRate,
          operationalHealth,
          lastActivityAt,
          zohoAccountId,
          alertIds: [],
        };

        blockSchools.push(school);
        districtSchools.push(school);
        schools.push(school);
      }

      const blockOnboardedCount = blockSchools.filter(
        (school) => school.onboardingStatus === "onboarded",
      ).length;
      const blockEngagement =
        blockSchools.reduce((sum, school) => sum + school.engagementRate, 0) /
        blockSchools.length;
      const blockOpenAlerts = blockSchools.filter(
        (school) => school.operationalHealth !== "good",
      ).length;

      const blockSummary: BlockSummary = {
        id: blockId,
        name: blockName,
        districtId: seed.id,
        totalSchools: blockSchools.length,
        schoolsOnboarded: blockOnboardedCount,
        engagementRate: Math.round(blockEngagement),
        operationalHealth: deriveOperationalHealth(
          blockEngagement,
          blockOperationalBaseline,
        ),
        openAlertCount: blockOpenAlerts,
        latitude:
          blockSchools.reduce((sum, s) => sum + s.latitude, 0) / blockSchools.length,
        longitude:
          blockSchools.reduce((sum, s) => sum + s.longitude, 0) / blockSchools.length,
      };

      districtBlocks.push(blockSummary);
      blocks.push(blockSummary);
    }

    const districtOnboardedCount = districtSchools.filter(
      (school) => school.onboardingStatus === "onboarded",
    ).length;
    const districtEngagement =
      districtSchools.reduce((sum, school) => sum + school.engagementRate, 0) /
      districtSchools.length;
    const districtOpenAlerts = districtSchools.filter(
      (school) => school.operationalHealth !== "good",
    ).length;

    districts.push({
      id: seed.id,
      name: seed.name,
      totalSchools: districtSchools.length,
      schoolsOnboarded: districtOnboardedCount,
      blockCount: districtBlocks.length,
      engagementRate: Math.round(districtEngagement),
      operationalHealth: deriveOperationalHealth(
        districtEngagement,
        districtBaselineOperational,
      ),
      openAlertCount: districtOpenAlerts,
      latitude: seed.latitude,
      longitude: seed.longitude,
    });
  }

  return { districts, blocks, schools };
}

export function toHierarchyNodes(
  districts: DistrictSummary[],
  blocks: BlockSummary[],
  schools: School[],
): GeographicHierarchy[] {
  const nodes: GeographicHierarchy[] = [];

  for (const district of districts) {
    nodes.push({
      id: district.id,
      name: district.name,
      level: "district",
      parentId: "tamil-nadu",
      districtId: district.id,
      blockId: null,
      schoolCode: null,
      latitude: district.latitude,
      longitude: district.longitude,
      status:
        district.schoolsOnboarded / district.totalSchools >= 0.95
          ? "onboarded"
          : district.schoolsOnboarded / district.totalSchools >= 0.55
            ? "in_progress"
            : "at_risk",
      onboardingProgress: Math.round(
        (district.schoolsOnboarded / district.totalSchools) * 100,
      ),
      engagementRate: district.engagementRate,
      operationalHealth: district.operationalHealth,
      zohoAccountId: null,
    });
  }

  for (const block of blocks) {
    nodes.push({
      id: block.id,
      name: block.name,
      level: "block",
      parentId: block.districtId,
      districtId: block.districtId,
      blockId: block.id,
      schoolCode: null,
      latitude: block.latitude,
      longitude: block.longitude,
      status:
        block.schoolsOnboarded / block.totalSchools >= 0.95
          ? "onboarded"
          : block.schoolsOnboarded / block.totalSchools >= 0.55
            ? "in_progress"
            : "at_risk",
      onboardingProgress: Math.round(
        (block.schoolsOnboarded / block.totalSchools) * 100,
      ),
      engagementRate: block.engagementRate,
      operationalHealth: block.operationalHealth,
      zohoAccountId: null,
    });
  }

  for (const school of schools) {
    nodes.push({
      id: school.id,
      name: school.name,
      level: "school",
      parentId: school.blockId,
      districtId: school.districtId,
      blockId: school.blockId,
      schoolCode: school.schoolCode,
      latitude: school.latitude,
      longitude: school.longitude,
      status: school.onboardingStatus,
      onboardingProgress:
        school.studentCount > 0
          ? Math.round((school.studentAccountsCreated / school.studentCount) * 100)
          : 0,
      engagementRate: school.engagementRate,
      operationalHealth: school.operationalHealth,
      zohoAccountId: school.zohoAccountId,
    });
  }

  return nodes;
}
