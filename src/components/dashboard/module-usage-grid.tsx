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

export function ModuleUsageGrid({ stats }: { stats: ModuleUsageStat[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {stats.map((stat) => {
        const Icon = MODULE_ICON[stat.id] ?? BookOpen;
        return (
          <div
            key={stat.id}
            className="flex w-36 shrink-0 flex-col gap-2 rounded-lg bg-accent p-4"
          >
            <Icon size={22} weight="fill" className="text-primary" />
            <div className="mt-3 space-y-0.5">
              <p className="text-xl font-semibold tabular-nums text-foreground">{formatCompactNumber(stat.count)}</p>
              <p className="text-sm text-muted-foreground">{stat.module}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
