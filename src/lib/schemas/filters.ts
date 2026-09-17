import { z } from "zod";

export const geographyLevelSchema = z.enum(["state", "district", "block", "school"]);
export const priorityScheme = z.enum(["low", "medium", "high", "critical"]);
export const alertStatusSchema = z.enum(["open", "acknowledged", "resolved"]);
export const alertCategorySchema = z.enum([
  "deployment",
  "engagement",
  "operational",
  "support",
]);
export const administrativeLevelSchema = z.enum(["state", "district", "block", "school"]);
export const notificationTypeSchema = z.enum([
  "alert",
  "deployment",
  "system",
  "engagement",
]);

export const alertFiltersSchema = z.object({
  search: z.string().trim().max(200).optional(),
  priority: z.array(priorityScheme).optional(),
  status: z.array(alertStatusSchema).optional(),
  category: z.array(alertCategorySchema).optional(),
  geographyType: geographyLevelSchema.optional(),
  geographyId: z.string().max(200).optional(),
  sortBy: z.enum(["priority", "age", "variance"]).default("priority"),
});
export type AlertFiltersInput = z.infer<typeof alertFiltersSchema>;

export const mapFiltersSchema = z.object({
  search: z.string().trim().max(200).optional(),
  priority: z.array(priorityScheme).optional(),
  onboardingStatus: z
    .array(z.enum(["not_started", "in_progress", "onboarded", "at_risk"]))
    .optional(),
  minEngagement: z.number().min(0).max(100).optional(),
  maxEngagement: z.number().min(0).max(100).optional(),
  districtId: z.string().max(200).optional(),
  blockId: z.string().max(200).optional(),
});
export type MapFiltersInput = z.infer<typeof mapFiltersSchema>;

export const directoryFiltersSchema = z.object({
  search: z.string().trim().max(200).optional(),
  administrativeLevel: z.array(administrativeLevelSchema).optional(),
  districtId: z.string().max(200).optional(),
  blockId: z.string().max(200).optional(),
});
export type DirectoryFiltersInput = z.infer<typeof directoryFiltersSchema>;

export const notificationFiltersSchema = z.object({
  type: z.array(notificationTypeSchema).optional(),
  unreadOnly: z.boolean().optional(),
});
export type NotificationFiltersInput = z.infer<typeof notificationFiltersSchema>;
