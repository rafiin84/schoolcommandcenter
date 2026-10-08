import {
  BookOpen,
  BookmarkSimple,
  CalendarCheck,
  Certificate,
  ChatCircleText,
  ClipboardText,
  FilePdf,
  ListChecks,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { ModuleUsageStat } from "@/types";
import { formatCompactNumber } from "@/lib/formatters";

const MODULE_ICON: Record<string, React.ComponentType<IconProps>> = {
  feeds: ChatCircleText,
  assignments: ClipboardText,
  exams: Certificate,
  courses: BookOpen,
  attendance: CalendarCheck,
  "practise-test": ListChecks,
  "question-papers": FilePdf,
  syllabus: BookmarkSimple,
};

export type ModuleUsagePeriod = "week" | "month" | "year";

export const MODULE_USAGE_PERIODS: { value: ModuleUsagePeriod; label: string }[] = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
];

// The mock dataset only carries all-time counts, so each period is an
// illustrative share of that total (stable per module, no random jitter).
const PERIOD_SHARE: Record<ModuleUsagePeriod, number> = { week: 0.02, month: 0.09, year: 0.55 };

function countFor(stat: ModuleUsageStat, period: ModuleUsagePeriod): number {
  return Math.round(stat.count * PERIOD_SHARE[period]);
}

export function ModuleUsageGrid({ stats, period }: { stats: ModuleUsageStat[]; period: ModuleUsagePeriod }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      {stats.map((stat) => {
        const Icon = MODULE_ICON[stat.id] ?? BookOpen;
        return (
          <div
            key={stat.id}
            className="flex min-h-36 flex-col gap-2 rounded-lg bg-accent p-5"
          >
            <Icon size={22} weight="fill" className="text-primary" />
            <div className="mt-3 space-y-0.5">
              <p className="text-xl font-semibold tabular-nums text-foreground">{formatCompactNumber(countFor(stat, period))}</p>
              <p className="text-sm text-muted-foreground">{stat.module}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
