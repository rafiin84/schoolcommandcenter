import type { MockAccessState, ZohoAccountStatus } from "./common";

/** Raw shape of the imported real Tamil Nadu school directory JSON: District name -> Block number -> school names. */
export type SchoolDirectoryRaw = Record<string, Record<string, string[]>>;

/**
 * A Zoho Classes account backed by the real school directory dataset,
 * used only by the Zoho Classes Access page. Deliberately a separate
 * shape from `ZohoClassesAccount` (which links to the procedurally
 * generated schools used by the Education Map / Alerts) since this
 * dataset has no relationship to that procedural schoolId space.
 */
export interface DirectorySchoolAccount {
  id: string;
  schoolName: string;
  districtId: string;
  districtName: string;
  blockId: string;
  blockLabel: string;
  loginEmail: string;
  loginUrl: string;
  environmentLabel: string;
  status: ZohoAccountStatus;
  lastVerifiedAt: string;
  region: string;
  mockAccessState: MockAccessState;
}
