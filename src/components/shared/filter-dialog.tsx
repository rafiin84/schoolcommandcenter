"use client";

import { useEffect, useState } from "react";
import type { IconProps } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SortIcon } from "@/components/shared/sort-menu";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<IconProps>;
}

export interface FilterSection {
  key: string;
  label: string;
  options: FilterOption[];
  /** Only one option can be picked (selecting it again clears it). */
  single?: boolean;
}

export type FilterValues = Record<string, string[]>;

export function countFilters(values: FilterValues): number {
  return Object.values(values).reduce((sum, list) => sum + list.length, 0);
}

/** Zoho Classes filter dialog: category list on the left, option tiles on the right, Clear / Apply footer. */
export function FilterDialog({
  open,
  onOpenChange,
  sections,
  value,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: FilterSection[];
  value: FilterValues;
  onApply: (next: FilterValues) => void;
}) {
  const [draft, setDraft] = useState<FilterValues>(value);
  const [activeKey, setActiveKey] = useState(sections[0]?.key ?? "");

  // Start every opening from the applied filters.
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const active = sections.find((s) => s.key === activeKey) ?? sections[0];

  function toggle(section: FilterSection, optionValue: string) {
    setDraft((prev) => {
      const current = prev[section.key] ?? [];
      const has = current.includes(optionValue);
      const next = section.single ? (has ? [] : [optionValue]) : has ? current.filter((v) => v !== optionValue) : [...current, optionValue];
      return { ...prev, [section.key]: next };
    });
  }

  function clear() {
    const empty = Object.fromEntries(sections.map((s) => [s.key, [] as string[]]));
    setDraft(empty);
    onApply(empty);
    onOpenChange(false);
  }

  function apply() {
    onApply(draft);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(34rem,calc(100svh-4rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <SortIcon size={22} className="text-foreground" />
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
          <DialogDescription className="sr-only">Choose filters, then apply.</DialogDescription>
        </div>

        <div className="flex min-h-0 flex-1">
          <nav aria-label="Filter categories" className="w-52 shrink-0 overflow-y-auto border-r border-border sm:w-64">
            {sections.map((section) => {
              const count = (draft[section.key] ?? []).length;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveKey(section.key)}
                  aria-current={section.key === active?.key}
                  className={cn(
                    "flex w-full items-center justify-between px-6 py-4 text-left text-base transition-colors hover:bg-accent/50",
                    section.key === active?.key ? "bg-accent text-primary" : "text-foreground",
                  )}
                >
                  {section.label}
                  {count > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-wrap gap-4">
              {active?.options.map((option) => {
                const selected = (draft[active.key] ?? []).includes(option.value);
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggle(active, option.value)}
                    aria-pressed={selected}
                    className={cn(
                      "flex h-32 w-36 flex-col items-center justify-center gap-3 rounded-xl border px-3 text-center text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected
                        ? "border-primary bg-accent text-primary"
                        : "border-border bg-card text-foreground/80 hover:border-primary/50",
                    )}
                  >
                    {Icon && <Icon size={30} />}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
          <Button onClick={apply}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
