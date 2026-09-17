import type { BlockSummary, DistrictSummary, LeadershipContact, School } from "@/types";
import { ADMIN_TITLES, FIRST_NAMES, LAST_NAMES } from "./names";
import { createRng, pick, randInt } from "./prng";

const AVAILABILITY_LABELS = [
  "Available",
  "In the field",
  "In review meetings today",
  "Out until Monday",
] as const;

function syntheticEmail(name: string, domain: string): string {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@${domain}`;
}

function syntheticPhone(rng: ReturnType<typeof createRng>): string {
  const n = () => randInt(rng, 0, 9);
  return `+91 ${randInt(rng, 70000, 99999)} ${n()}${n()}${n()}${n()}${n()}`;
}

function generatePersonName(seed: string): string {
  const rng = createRng(seed);
  return `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
}

export function generateLeadershipDirectory(
  districts: DistrictSummary[],
  blocks: BlockSummary[],
  schools: School[],
): LeadershipContact[] {
  const contacts: LeadershipContact[] = [];

  contacts.push({
    id: "contact-state-1",
    name: generatePersonName("contact-state-1"),
    title: ADMIN_TITLES.state[0],
    administrativeLevel: "state",
    districtId: null,
    blockId: null,
    schoolId: null,
    responsibility: "Statewide Zoho Classes deployment oversight",
    email: "principal.secretary.education@mock.tn.gov.in",
    phone: "+91 44 2854 0100",
    avatarUrl: "",
    availabilityLabel: "Available",
  });

  contacts.push({
    id: "contact-state-2",
    name: generatePersonName("contact-state-2"),
    title: ADMIN_TITLES.state[1],
    administrativeLevel: "state",
    districtId: null,
    blockId: null,
    schoolId: null,
    responsibility: "Digital Learning Mission program management",
    email: "spd.digitallearning@mock.tn.gov.in",
    phone: "+91 44 2854 0142",
    avatarUrl: "",
    availabilityLabel: "In review meetings today",
  });

  for (const district of districts) {
    const rng = createRng(`contact-district:${district.id}`);
    const name = generatePersonName(`contact-district-name:${district.id}`);
    contacts.push({
      id: `contact-district-${district.id}`,
      name,
      title: pick(rng, ADMIN_TITLES.district),
      administrativeLevel: "district",
      districtId: district.id,
      blockId: null,
      schoolId: null,
      responsibility: `Deployment coordination for ${district.name} district`,
      email: syntheticEmail(name, `${district.id}.mock.tn.gov.in`),
      phone: syntheticPhone(rng),
      avatarUrl: "",
      availabilityLabel: pick(rng, AVAILABILITY_LABELS),
    });
  }

  const attentionBlocks = blocks.filter((block) => block.operationalHealth !== "good");
  const sampledBlocks = attentionBlocks.length > 0 ? attentionBlocks : blocks.slice(0, 40);

  for (const block of sampledBlocks) {
    const rng = createRng(`contact-block:${block.id}`);
    const name = generatePersonName(`contact-block-name:${block.id}`);
    contacts.push({
      id: `contact-block-${block.id}`,
      name,
      title: pick(rng, ADMIN_TITLES.block),
      administrativeLevel: "block",
      districtId: block.districtId,
      blockId: block.id,
      schoolId: null,
      responsibility: `School readiness and support for ${block.name}`,
      email: syntheticEmail(name, `${block.districtId}.mock.tn.gov.in`),
      phone: syntheticPhone(rng),
      avatarUrl: "",
      availabilityLabel: pick(rng, AVAILABILITY_LABELS),
    });
  }

  const attentionSchools = schools.filter((school) => school.operationalHealth === "critical");
  for (const school of attentionSchools) {
    const rng = createRng(`contact-school:${school.id}`);
    const name = generatePersonName(`contact-school-name:${school.id}`);
    contacts.push({
      id: `contact-school-${school.id}`,
      name,
      title: pick(rng, ADMIN_TITLES.school),
      administrativeLevel: "school",
      districtId: school.districtId,
      blockId: school.blockId,
      schoolId: school.id,
      responsibility: `Day-to-day Zoho Classes administration at ${school.name}`,
      email: syntheticEmail(name, `${school.schoolCode.toLowerCase()}.mock.edu.in`),
      phone: syntheticPhone(rng),
      avatarUrl: "",
      availabilityLabel: pick(rng, AVAILABILITY_LABELS),
    });
  }

  return contacts;
}
