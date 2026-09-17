"use client";

import Link from "next/link";
import type { DistrictSummary } from "@/types";
import { OPERATIONAL_HEALTH_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const HEALTH_TILE_CLASS: Record<DistrictSummary["operationalHealth"], string> = {
  good: "bg-status-good/15 hover:bg-status-good/25 text-status-good",
  watch: "bg-status-warning/20 hover:bg-status-warning/30 text-amber-900 dark:text-status-warning",
  critical: "bg-status-critical/15 hover:bg-status-critical/25 text-status-critical",
};

export function DistrictHealthGrid({ districts }: { districts: DistrictSummary[] }) {
  const sorted = [...districts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8">
        {sorted.map((district) => (
          <Link
            key={district.id}
            href={`/education-map?focus=${district.id}`}
            title={`${district.name} — ${OPERATIONAL_HEALTH_LABEL[district.operationalHealth]}, ${district.engagementRate}% engagement`}
            className={cn(
              "flex aspect-square items-center justify-center rounded-lg text-[9px] font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              HEALTH_TILE_CLASS[district.operationalHealth],
            )}
          >
            {district.name.slice(0, 2)}
          </Link>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-status-good/60" /> Healthy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-status-warning/60" /> Needs watching
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-status-critical/60" /> Critical
        </span>
      </div>
    </div>
  );
}
