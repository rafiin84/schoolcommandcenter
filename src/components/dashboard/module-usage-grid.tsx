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

const MODULE_STYLE: Record<string, { icon: React.ComponentType<IconProps>; tone: string; iconTone: string }> = {
  feeds: { icon: ChatCircleText, tone: "bg-chart-1/8", iconTone: "bg-chart-1/15 text-chart-1" },
  assignments: { icon: ClipboardText, tone: "bg-chart-2/8", iconTone: "bg-chart-2/15 text-chart-2" },
  exams: { icon: Certificate, tone: "bg-status-critical/8", iconTone: "bg-status-critical/15 text-status-critical" },
  courses: { icon: BookOpen, tone: "bg-chart-3/8", iconTone: "bg-chart-3/15 text-chart-3" },
  attendance: { icon: CalendarCheck, tone: "bg-chart-4/8", iconTone: "bg-chart-4/15 text-chart-4" },
  "practise-test": { icon: ListChecks, tone: "bg-chart-5/8", iconTone: "bg-chart-5/15 text-chart-5" },
  "question-papers": { icon: FilePdf, tone: "bg-brand-accent/8", iconTone: "bg-brand-accent/15 text-brand-accent" },
  syllabus: { icon: BookmarkSimple, tone: "bg-primary/8", iconTone: "bg-primary/15 text-primary" },
};

export function ModuleUsageGrid({ stats }: { stats: ModuleUsageStat[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 sm:gap-4">
      {stats.map((stat) => {
        const style = MODULE_STYLE[stat.id];
        const Icon = style?.icon ?? BookOpen;
        return (
          <div
            key={stat.id}
            className={`flex w-56 shrink-0 flex-col gap-3 rounded-2xl p-5 shadow-sm sm:w-64 ${style?.tone ?? "border border-border bg-card"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">{stat.module}</span>
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${style?.iconTone ?? "bg-muted text-muted-foreground"}`}>
                <Icon size={16} />
              </span>
            </div>
            <p className="text-kpi">{formatCompactNumber(stat.count)}</p>
            <p className="text-xs text-muted-foreground">{stat.helpText}</p>
          </div>
        );
      })}
    </div>
  );
}
