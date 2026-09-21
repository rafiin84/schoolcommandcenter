import type {
  AlertCategory,
  NotificationType,
  OnboardingStatus,
  OperationalHealth,
  Priority,
} from "@/types";

export const NAV_ITEMS = [
  { href: "/overview", label: "Overview", icon: "Gauge" },
  { href: "/announcements", label: "Announcements", icon: "Megaphone" },
  { href: "/education-map", label: "Education Map", icon: "MapTrifold" },
  { href: "/alerts", label: "Alerts & Exceptions", icon: "Warning" },
  { href: "/zoho-access", label: "Zoho Classes Access", icon: "SignIn" },
  { href: "/course-template", label: "Course Template", icon: "SquaresFour" },
  { href: "/directory", label: "Directory", icon: "AddressBook" },
] as const;

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const OPERATIONAL_HEALTH_LABEL: Record<OperationalHealth, string> = {
  good: "Healthy",
  watch: "Needs watching",
  critical: "Critical",
};

export const ONBOARDING_STATUS_LABEL: Record<OnboardingStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  onboarded: "Onboarded",
  at_risk: "At risk",
};

export const ALERT_CATEGORY_LABEL: Record<AlertCategory, string> = {
  deployment: "Deployment",
  engagement: "Engagement",
  operational: "Operational",
  support: "Support",
};

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  alert: "Alerts",
  deployment: "Deployment",
  system: "System",
  engagement: "Engagement",
};

export const MOCK_LATENCY_MS = { min: 250, max: 650 } as const;

/**
 * Real-world Tamil Nadu statewide totals used to scale the Overview KPIs.
 * The detailed per-school sample dataset (map/directory/alerts) stays at a
 * manageable illustrative size — these totals are the headline denominators.
 */
export const STATEWIDE_TOTAL_SCHOOLS = 35_000;
export const STATEWIDE_TOTAL_STUDENTS = 50_00_000;
export const STATEWIDE_TOTAL_TEACHERS = 2_50_000;
export const STATEWIDE_TOTAL_ZOHO_ACCOUNTS = 700;

export const SIMULATE_ERROR_QUERY_KEY = "mockError";
