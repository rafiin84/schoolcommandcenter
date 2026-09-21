"use client";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import type { AlertCategory, AlertStatus, Priority } from "@/types";
import { ALERT_CATEGORY_LABEL, PRIORITY_LABEL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRIORITY_OPTIONS: Priority[] = ["critical", "high", "medium", "low"];
const STATUS_OPTIONS: AlertStatus[] = ["open", "acknowledged", "resolved"];
const CATEGORY_OPTIONS: AlertCategory[] = ["deployment", "engagement", "operational", "support"];

export interface AlertFilterState {
  search: string;
  priority: Priority[];
  status: AlertStatus[];
  category: AlertCategory[];
  sortBy: "priority" | "age" | "variance";
}

export function AlertFilters({
  value,
  onChange,
}: {
  value: AlertFilterState;
  onChange: (next: AlertFilterState) => void;
}) {
  function toggle<T>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  }

  const hasActiveFilters =
    value.search || value.priority.length > 0 || value.status.length > 0 || value.category.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            placeholder="Search alerts by title or description…"
            className="pl-9"
            aria-label="Search alerts"
          />
        </div>
        <Select value={value.sortBy} onValueChange={(v) => onChange({ ...value, sortBy: v as AlertFilterState["sortBy"] })}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Sort by priority</SelectItem>
            <SelectItem value="age">Sort by age</SelectItem>
            <SelectItem value="variance">Sort by target variance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Priority</span>
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ ...value, priority: toggle(value.priority, p) })}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                value.priority.includes(p)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={value.priority.includes(p)}
            >
              {PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Status</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ ...value, status: toggle(value.status, s) })}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                value.status.includes(s)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={value.status.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="shrink-0 text-xs font-medium text-muted-foreground">Category</span>
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...value, category: toggle(value.category, c) })}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                value.category.includes(c)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={value.category.includes(c)}
            >
              {ALERT_CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => onChange({ search: "", priority: [], status: [], category: [], sortBy: value.sortBy })}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
