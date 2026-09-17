import type { School, ZohoClassesAccount } from "@/types";
import { createRng, randInt } from "./prng";

const ENVIRONMENT_LABELS = [
  "Zoho Classes — TN State Board",
  "Zoho Classes — Matriculation Stream",
  "Zoho Classes — Primary Wing",
] as const;

/**
 * Every onboarded/in-progress school gets a mapped, mock Zoho Classes
 * account. The login URL is a clearly-labeled mock destination — the
 * Command Center never renders a password field.
 */
export function generateZohoAccounts(schools: School[]): ZohoClassesAccount[] {
  return schools
    .filter((school) => school.zohoAccountId !== null)
    .map((school) => {
      const rng = createRng(`zoho:${school.id}`);
      const daysAgo = randInt(rng, 0, 10);
      const status: ZohoClassesAccount["status"] =
        school.onboardingStatus === "onboarded"
          ? "active"
          : school.operationalHealth === "critical"
            ? "suspended"
            : "pending";

      return {
        id: school.zohoAccountId as string,
        accountName: `${school.name} — Zoho Classes`,
        accountReference: `ZC-${school.schoolCode}`,
        loginUrl: "https://classes.zoho.com/mock/login",
        environmentLabel:
          ENVIRONMENT_LABELS[
            Math.floor(rng() * ENVIRONMENT_LABELS.length)
          ],
        assignedSchoolId: school.id,
        status,
        lastVerifiedAt: new Date(
          Date.now() - daysAgo * 24 * 60 * 60 * 1000,
        ).toISOString(),
        region: "Tamil Nadu",
        mockAccessState: status === "active" ? "ready" : "simulated_redirect",
      } satisfies ZohoClassesAccount;
    });
}
