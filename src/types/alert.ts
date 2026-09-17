import type {
  AlertCategory,
  AlertStatus,
  GeographyLevel,
  Priority,
} from "./common";

export interface AlertException {
  id: string;
  title: string;
  description: string;
  geographyType: GeographyLevel;
  geographyId: string;
  priority: Priority;
  status: AlertStatus;
  category: AlertCategory;
  metricName: string;
  currentValue: number;
  targetValue: number;
  createdAt: string;
  dueAt: string | null;
  responsibleContactId: string | null;
  recommendedAction: string;
  supportingKpiIds: string[];
}
