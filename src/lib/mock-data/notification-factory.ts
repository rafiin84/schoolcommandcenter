import type { AlertException, DistrictSummary, Notification } from "@/types";
import { createRng, randInt } from "./prng";

function timeAgoIso(daysAgo: number, hoursAgo = 0): string {
  return new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000,
  ).toISOString();
}

export function generateNotifications(
  alerts: AlertException[],
  districts: DistrictSummary[],
): Notification[] {
  const notifications: Notification[] = [];
  let counter = 0;
  const nextId = () => `notif-${(++counter).toString().padStart(4, "0")}`;

  const highPriorityAlerts = alerts
    .filter((a) => (a.priority === "critical" || a.priority === "high") && a.status !== "resolved")
    .slice(0, 24);

  for (const alert of highPriorityAlerts) {
    const rng = createRng(`notif-alert:${alert.id}`);
    notifications.push({
      id: nextId(),
      title: alert.title,
      body: alert.description,
      type: "alert",
      priority: alert.priority === "critical" ? "high" : "medium",
      createdAt: timeAgoIso(randInt(rng, 0, 6), randInt(rng, 0, 23)),
      read: rng() < 0.4,
      linkedEntityType: "alert",
      linkedEntityId: alert.id,
      actionLabel: "View alert",
    });
  }

  const sampleDistricts = districts.slice(0, 8);
  const deploymentTemplates = [
    (name: string) => `${name} district crossed a new onboarding milestone this week.`,
    (name: string) => `Weekly readiness digest is available for ${name} district.`,
    (name: string) => `Block education officers in ${name} completed the quarterly review checklist.`,
  ];
  for (const district of sampleDistricts) {
    const rng = createRng(`notif-deploy:${district.id}`);
    const template = deploymentTemplates[randInt(rng, 0, deploymentTemplates.length - 1)];
    notifications.push({
      id: nextId(),
      title: `Update from ${district.name}`,
      body: template(district.name),
      type: "deployment",
      priority: "low",
      createdAt: timeAgoIso(randInt(rng, 1, 12), randInt(rng, 0, 23)),
      read: rng() < 0.6,
      linkedEntityType: "district",
      linkedEntityId: district.id,
      actionLabel: "View district",
    });
  }

  const systemNotifications: Array<Pick<Notification, "title" | "body">> = [
    {
      title: "Mock data refreshed",
      body: "This illustrative environment regenerated its statewide dataset. No production systems were affected.",
    },
    {
      title: "Scheduled maintenance window",
      body: "A mock maintenance window is illustrated for this weekend between 11:00 PM and 2:00 AM IST.",
    },
    {
      title: "New AI insight layer available",
      body: "Illustrative AI analysis is now available on the Overview and Alerts pages. All insights are generated from mock data.",
    },
  ];
  systemNotifications.forEach((item, index) => {
    const rng = createRng(`notif-system:${index}`);
    notifications.push({
      id: nextId(),
      title: item.title,
      body: item.body,
      type: "system",
      priority: "low",
      createdAt: timeAgoIso(randInt(rng, 2, 20), 0),
      read: rng() < 0.7,
      linkedEntityType: null,
      linkedEntityId: null,
      actionLabel: null,
    });
  });

  const engagementDistricts = districts
    .filter((d) => d.engagementRate < 55)
    .slice(0, 6);
  for (const district of engagementDistricts) {
    const rng = createRng(`notif-engagement:${district.id}`);
    notifications.push({
      id: nextId(),
      title: `Engagement dip flagged in ${district.name}`,
      body: `Illustrative engagement tracking shows a softening trend in ${district.name} over the last two weeks.`,
      type: "engagement",
      priority: "medium",
      createdAt: timeAgoIso(randInt(rng, 0, 9), randInt(rng, 0, 23)),
      read: rng() < 0.3,
      linkedEntityType: "district",
      linkedEntityId: district.id,
      actionLabel: "View district",
    });
  }

  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
