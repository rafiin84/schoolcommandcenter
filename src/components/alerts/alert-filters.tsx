"use client";

import {
  ArrowDown,
  Bell,
  CheckCircle,
  Eye,
  Gear,
  Headset,
  MapPin,
  MinusCircle,
  Rocket,
  TrendUp,
  Warning,
  WarningOctagon,
} from "@phosphor-icons/react/dist/ssr";
import type { AlertCategory, AlertStatus, Priority } from "@/types";
import { ALERT_CATEGORY_LABEL, PRIORITY_LABEL } from "@/lib/constants";
import { FilterDialog, type FilterSection, type FilterValues } from "@/components/shared/filter-dialog";

export interface AlertFilterState {
  search: string;
  priority: Priority[];
  status: AlertStatus[];
  category: AlertCategory[];
  sortBy: "priority" | "age" | "variance";
}

const PRIORITY_ICON = { critical: WarningOctagon, high: Warning, medium: MinusCircle, low: ArrowDown };
const STATUS_ICON = { open: Bell, acknowledged: Eye, resolved: CheckCircle };
const CATEGORY_ICON = { deployment: Rocket, engagement: TrendUp, operational: Gear, support: Headset };

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
    key: "status",
    label: "Status",
    options: (["open", "acknowledged", "resolved"] as AlertStatus[]).map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
      icon: STATUS_ICON[s],
    })),
  },
  {
    key: "category",
    label: "Category",
    options: (["deployment", "engagement", "operational", "support"] as AlertCategory[]).map((c) => ({
      value: c,
      label: ALERT_CATEGORY_LABEL[c],
      icon: CATEGORY_ICON[c],
    })),
  },
  {
    key: "group",
    label: "Group",
    single: true,
    options: [{ value: "district", label: "By district", icon: MapPin }],
  },
];

export function AlertFilterDialog({
  open,
  onOpenChange,
  value,
  onChange,
  groupByDistrict,
  onGroupChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: AlertFilterState;
  onChange: (next: AlertFilterState) => void;
  groupByDistrict: boolean;
  onGroupChange: (group: boolean) => void;
}) {
  const current: FilterValues = {
    priority: value.priority,
    status: value.status,
    category: value.category,
    group: groupByDistrict ? ["district"] : [],
  };

  return (
    <FilterDialog
      open={open}
      onOpenChange={onOpenChange}
      sections={SECTIONS}
      value={current}
      onApply={(next) => {
        onChange({
          ...value,
          priority: next.priority as Priority[],
          status: next.status as AlertStatus[],
          category: next.category as AlertCategory[],
        });
        onGroupChange(next.group.length > 0);
      }}
    />
  );
}
