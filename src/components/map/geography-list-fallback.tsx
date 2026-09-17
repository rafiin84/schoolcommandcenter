"use client";

import type { GeographicHierarchy } from "@/types";
import { OnboardingStatusBadge, OperationalHealthBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export function GeographyListFallback({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: GeographicHierarchy[];
  selectedId: string | null;
  onSelect: (node: GeographicHierarchy) => void;
}) {
  if (nodes.length === 0) {
    return (
      <EmptyState
        title="No matching geography"
        description="Try adjusting your search or filters to see districts, blocks, or schools."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2" role="list" aria-label="Geography list">
      {nodes.map((node) => (
        <li key={node.id}>
          <button
            type="button"
            onClick={() => onSelect(node)}
            className={cn(
              "flex w-full min-h-11 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              selectedId === node.id && "border-primary bg-accent",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{node.name}</p>
              <p className="text-xs text-muted-foreground">
                {node.schoolCode ? `${node.schoolCode} · ` : ""}
                {node.engagementRate}% engagement
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
              <OnboardingStatusBadge status={node.status} />
              <OperationalHealthBadge health={node.operationalHealth} className="hidden sm:inline-flex" />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
