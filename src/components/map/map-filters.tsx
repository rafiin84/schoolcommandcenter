"use client";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import type { OnboardingStatus, Priority } from "@/types";
import { ONBOARDING_STATUS_LABEL, PRIORITY_LABEL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMapStore } from "@/store/map-store";
import { cn } from "@/lib/utils";

const PRIORITY_OPTIONS: Priority[] = ["critical", "high", "medium", "low"];
const STATUS_OPTIONS: OnboardingStatus[] = ["onboarded", "in_progress", "at_risk", "not_started"];
const ENGAGEMENT_PRESETS = [
  { label: "Any engagement", min: null, max: null },
  { label: "Below 50%", min: null, max: 50 },
  { label: "Below 30%", min: null, max: 30 },
] as const;

export function MapFilters() {
  const filters = useMapStore((s) => s.filters);
  const setSearch = useMapStore((s) => s.setSearch);
  const togglePriority = useMapStore((s) => s.togglePriority);
  const toggleOnboardingStatus = useMapStore((s) => s.toggleOnboardingStatus);
  const setEngagementRange = useMapStore((s) => s.setEngagementRange);
  const resetFilters = useMapStore((s) => s.resetFilters);

  const hasActiveFilters =
    filters.search ||
    filters.priority.length > 0 ||
    filters.onboardingStatus.length > 0 ||
    filters.maxEngagement !== null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search district, block, school, or school code…"
          className="pl-9"
          aria-label="Search the education map"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Priority</span>
          {PRIORITY_OPTIONS.map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => togglePriority(priority)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                filters.priority.includes(priority)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={filters.priority.includes(priority)}
            >
              {PRIORITY_LABEL[priority]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Onboarding</span>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => toggleOnboardingStatus(status)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                filters.onboardingStatus.includes(status)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={filters.onboardingStatus.includes(status)}
            >
              {ONBOARDING_STATUS_LABEL[status]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Engagement</span>
          {ENGAGEMENT_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setEngagementRange(preset.min, preset.max)}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                filters.maxEngagement === preset.max
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={filters.maxEngagement === preset.max}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
