import type { MockAccessState, ZohoAccountStatus } from "./common";

/**
 * A mock mapping between a school and its Zoho Classes environment.
 * Modeled with an `assignedSchoolId` (rather than embedding the account
 * on the school) so a future shared-account model — one Zoho account
 * serving multiple schools — is a additive change, not a rewrite.
 */
export interface ZohoClassesAccount {
  id: string;
  accountName: string;
  accountReference: string;
  loginUrl: string;
  environmentLabel: string;
  assignedSchoolId: string;
  status: ZohoAccountStatus;
  lastVerifiedAt: string;
  region: string;
  mockAccessState: MockAccessState;
}
