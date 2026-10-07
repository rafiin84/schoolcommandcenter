"use client";

import {
  ArrowDown,
  CheckCircle,
  Circle,
  Hourglass,
  MinusCircle,
  TrendDown,
  Warning,
  WarningDiamond,
  WarningOctagon,
} from "@phosphor-icons/react/dist/ssr";
import type { OnboardingStatus, Priority } from "@/types";
import { ONBOARDING_STATUS_LABEL, PRIORITY_LABEL } from "@/lib/constants";
import { FilterDialog, type FilterSection, type FilterValues } from "@/components/shared/filter-dialog";
import { useMapStore } from "@/store/map-store";

const PRIORITY_ICON = { critical: WarningOctagon, high: Warning, medium: MinusCircle, low: ArrowDown };
const STATUS_ICON = { onboarded: CheckCircle, in_progress: Hourglass, at_risk: WarningDiamond, not_started: Circle };

const SECTIONS: FilterSection[] = [
  {
    key: "priority",
    label: "Priority",
    options: (["critical", "high", "medium", "low"] as Priority[]).map((p) => ({
      value: p,
      label: PRIORITY_LABEL[p],
      icon: PRIORITY_ICON[p],
    })),
  },
  {
    key: "onboarding",
    label: "Onboarding",
    options: (["onboarded", "in_progress", "at_risk", "not_started"] as OnboardingStatus[]).map((s) => ({
      value: s,
      label: ONBOARDING_STATUS_LABEL[s],
      icon: STATUS_ICON[s],
    })),
  },
  {
    key: "engagement",
    label: "Engagement",
    single: true,
    options: [
      { value: "50", label: "Below 50%", icon: TrendDown },
      { value: "30", label: "Below 30%", icon: TrendDown },
    ],
  },
];

export function useMapFilterCount(): number {
  const filters = useMapStore((s) => s.filters);
  return filters.priority.length + filters.onboardingStatus.length + (filters.maxEngagement !== null ? 1 : 0);
}

export function MapFilterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);

  const value: FilterValues = {
    priority: filters.priority,
    onboarding: filters.onboardingStatus,
    engagement: filters.maxEngagement === null ? [] : [String(filters.maxEngagement)],
  };

  return (
    <FilterDialog
      open={open}
      onOpenChange={onOpenChange}
      sections={SECTIONS}
      value={value}
      onApply={(next) =>
        setFilters({
          priority: next.priority as Priority[],
          onboardingStatus: next.onboarding as OnboardingStatus[],
          minEngagement: null,
          maxEngagement: next.engagement[0] ? Number(next.engagement[0]) : null,
        })
      }
    />
  );
}
