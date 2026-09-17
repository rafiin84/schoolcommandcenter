import type { GeographyLevel, OnboardingStatus, OperationalHealth } from "./common";

/**
 * Unified node in the state → district → block → school hierarchy.
 * Districts and blocks are represented as GeographicHierarchy nodes;
 * schools carry additional fields and are represented by the richer
 * `School` type below (which is also assignable wherever a hierarchy
 * node is expected via `schoolToHierarchyNode`).
 */
export interface GeographicHierarchy {
  id: string;
  name: string;
  level: GeographyLevel;
  parentId: string | null;
  districtId: string | null;
  blockId: string | null;
  schoolCode: string | null;
  latitude: number;
  longitude: number;
  status: OnboardingStatus;
  onboardingProgress: number;
  engagementRate: number;
  operationalHealth: OperationalHealth;
  zohoAccountId: string | null;
}

export interface School {
  id: string;
  name: string;
  schoolCode: string;
  districtId: string;
  blockId: string;
  address: string;
  latitude: number;
  longitude: number;
  studentCount: number;
  teacherCount: number;
  studentAccountsCreated: number;
  teacherAccountsCreated: number;
  onboardingStatus: OnboardingStatus;
  engagementRate: number;
  operationalHealth: OperationalHealth;
  lastActivityAt: string;
  zohoAccountId: string | null;
  alertIds: string[];
}

export interface DistrictSummary {
  id: string;
  name: string;
  totalSchools: number;
  schoolsOnboarded: number;
  blockCount: number;
  engagementRate: number;
  operationalHealth: OperationalHealth;
  openAlertCount: number;
  latitude: number;
  longitude: number;
}

export interface BlockSummary {
  id: string;
  name: string;
  districtId: string;
  totalSchools: number;
  schoolsOnboarded: number;
  engagementRate: number;
  operationalHealth: OperationalHealth;
  openAlertCount: number;
  latitude: number;
  longitude: number;
}
