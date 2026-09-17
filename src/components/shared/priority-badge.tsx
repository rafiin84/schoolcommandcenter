import { WarningOctagon } from "@phosphor-icons/react/dist/ssr";
import type { Priority } from "@/types";
import { PRIORITY_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PRIORITY_CLASSES: Record<Priority, string> = {
  low: "bg-muted border-border text-muted-foreground",
  medium: "bg-status-warning/15 border-status-warning/30 text-foreground",
  high: "bg-status-serious/15 border-status-serious/30 text-foreground",
  critical: "bg-status-critical/12 border-status-critical/30 text-foreground",
};

const PRIORITY_ICON_CLASSES: Record<Priority, string> = {
  low: "text-muted-foreground",
  medium: "text-status-warning",
  high: "text-status-serious",
  critical: "text-status-critical",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-badge inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        PRIORITY_CLASSES[priority],
        className,
      )}
    >
      <WarningOctagon
        size={13}
        weight="fill"
        aria-hidden
        className={PRIORITY_ICON_CLASSES[priority]}
      />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
