/**
 * Shared primitive types used across the domain model.
 */

export type OnboardingStatus =
  | "not_started"
  | "in_progress"
  | "onboarded"
  | "at_risk";

export type OperationalHealth = "good" | "watch" | "critical";

export type TrendDirection = "up" | "down" | "flat";

export type GeographyLevel = "state" | "district" | "block" | "school";

export type Priority = "low" | "medium" | "high" | "critical";

export type AlertStatus = "open" | "acknowledged" | "resolved";

export type AlertCategory =
  | "deployment"
  | "engagement"
  | "operational"
  | "support";

export type AdministrativeLevel =
  | "state"
  | "district"
  | "block"
  | "school";

export type NotificationType =
  | "alert"
  | "deployment"
  | "system"
  | "engagement";

export type NotificationPriority = "low" | "medium" | "high";

export type InsightType =
  | "deployment_gap"
  | "engagement_pattern"
  | "operational_risk"
  | "positive_trend";

export type InsightStatus = "new" | "reviewed" | "dismissed";

export type ZohoAccountStatus = "active" | "pending" | "suspended";

export type MockAccessState = "ready" | "simulated_redirect" | "unavailable";

/**
 * Standard envelope returned by every mock service function, so consuming
 * code has one shape to branch on regardless of endpoint.
 */
export interface ApiResponse<T> {
  data: T;
  meta: {
    sourceLabel: string;
    generatedAt: string;
    isMock: true;
  };
}

export interface ApiError {
  message: string;
  code: "not_found" | "simulated_failure" | "invalid_input";
}
