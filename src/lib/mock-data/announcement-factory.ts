import type { Announcement, AnnouncementAttachment, AnnouncementCategory, DistrictSummary } from "@/types";
import { createRng, pick, randInt } from "./prng";
import { FIRST_NAMES, LAST_NAMES } from "./names";

function timeAgoIso(daysAgo: number, hoursAgo = 0): string {
  return new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000,
  ).toISOString();
}

function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function authorFor(seed: string, role: string) {
  const rng = createRng(seed);
  const name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
  return { authorName: name, authorRole: role, authorInitials: initialsFor(name) };
}

interface AnnouncementSeed {
  title: string;
  body: string;
  role: string;
  daysAgo: number;
  category: AnnouncementCategory;
  district?: DistrictSummary;
  attachments?: AnnouncementAttachment[];
}

export function generateAnnouncements(districts: DistrictSummary[]): Announcement[] {
  const sample = (index: number) => districts[index % districts.length];

  const seeds: AnnouncementSeed[] = [
    {
      title: "Statewide Zoho Classes rollout — Phase 2 begins",
      body: "Phase 2 onboarding opens this week for districts below 60% readiness. District Collectors should coordinate block-level training sessions before the end of the month.",
      role: "State Project Director, Digital Learning Mission",
      daysAgo: 0,
      category: "update",
      attachments: [
        {
          id: "att-1",
          kind: "youtube",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          name: "Phase 2 rollout briefing",
        },
      ],
    },
    {
      title: "New course template gallery is live",
      body: "The Course Template tab now links directly to the Zoho Classes template gallery — block education officers can preview and assign ready-made course structures without leaving the Command Center.",
      role: "Principal Secretary, School Education",
      daysAgo: 1,
      category: "introduction",
    },
    {
      title: `${sample(0).name} district crosses 90% onboarding`,
      body: `Congratulations to the ${sample(0).name} education team — the district has crossed 90% of its onboarding target this week, the fastest ramp statewide so far.`,
      role: "District Collector (Education Nodal)",
      daysAgo: 2,
      category: "milestone",
      district: sample(0),
      attachments: [
        {
          id: "att-2",
          kind: "image",
          url: "https://picsum.photos/seed/scc-announce-1/800/450",
          name: "Onboarding milestone celebration",
        },
      ],
    },
    {
      title: "Updated onboarding checklist (v3)",
      body: "An updated block-level onboarding checklist is attached, reflecting the revised Zoho Classes Access flow and login domain.",
      role: "State Project Director, Digital Learning Mission",
      daysAgo: 3,
      category: "guidance",
      attachments: [
        { id: "att-3", kind: "document", url: "#", name: "Onboarding-Checklist-v3.pdf" },
      ],
    },
    {
      title: `Readiness review scheduled for ${sample(1).name}`,
      body: `A joint readiness review with block education officers in ${sample(1).name} district is scheduled for next week. Agenda and dial-in details to follow.`,
      role: "Block Education Officer",
      daysAgo: 5,
      category: "update",
      district: sample(1),
    },
    {
      title: "Reminder: weekly engagement digest",
      body: "The weekly engagement digest is now available on the Overview page for every district. Districts below 55% engagement are flagged for follow-up.",
      role: "Principal Secretary, School Education",
      daysAgo: 6,
      category: "insight",
    },
    {
      title: `${sample(2).name} shares a training recap`,
      body: `Teacher-training sessions wrapped up across ${sample(2).name} district this week. Recording and photos from the closing session are attached.`,
      role: "District Collector (Education Nodal)",
      daysAgo: 8,
      category: "milestone",
      district: sample(2),
      attachments: [
        {
          id: "att-4",
          kind: "image",
          url: "https://picsum.photos/seed/scc-announce-2/800/450",
          name: "Training session recap",
        },
        { id: "att-5", kind: "document", url: "#", name: "Attendance-Summary.xlsx" },
      ],
    },
    {
      title: "Support desk hours extended",
      body: "The Zoho Classes support desk is now available until 8 PM IST on weekdays to help schools resolve access issues faster during the rollout window.",
      role: "State Project Director, Digital Learning Mission",
      daysAgo: 10,
      category: "guidance",
    },
  ];

  return seeds
    .map((seed, index) => {
      const author = authorFor(`announcement:${index}`, seed.role);
      const rng = createRng(`announcement-time:${index}`);
      return {
        id: `announce-${(index + 1).toString().padStart(3, "0")}`,
        ...author,
        createdAt: timeAgoIso(seed.daysAgo, randInt(rng, 0, 23)),
        category: seed.category,
        title: seed.title,
        body: seed.body,
        audienceLabel: seed.district ? `${seed.district.name} district` : "Statewide",
        districtId: seed.district?.id ?? null,
        attachments: seed.attachments ?? [],
      } satisfies Announcement;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
