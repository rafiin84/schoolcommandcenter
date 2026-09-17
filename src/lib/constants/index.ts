import type {
  AlertCategory,
  NotificationType,
  OnboardingStatus,
  OperationalHealth,
  Priority,
} from "@/types";

export const NAV_ITEMS = [
  { href: "/overview", label: "Overview", icon: "Gauge" },
  { href: "/education-map", label: "Education Map", icon: "MapTrifold" },
  { href: "/alerts", label: "Alerts & Exceptions", icon: "Warning" },
  { href: "/zoho-access", label: "Zoho Classes Access", icon: "SignIn" },
  { href: "/directory", label: "Directory", icon: "AddressBook" },
  { href: "/notifications", label: "Notifications", icon: "Bell" },
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

export const SIMULATE_ERROR_QUERY_KEY = "mockError";
