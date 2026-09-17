import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  label,
  showValue = true,
  tone = "accent",
  className,
}: {
  value: number;
  label?: string;
  showValue?: boolean;
  tone?: "accent" | "critical";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {label && <span>{label}</span>}
          {showValue && <span className="text-data font-medium text-foreground">{value}%</span>}
        </div>
      )}
      <Progress
        value={value}
        aria-label={label}
        className={cn(
          "[&_[data-slot=progress-track]]:h-2",
          tone === "critical"
            ? "[&_[data-slot=progress-indicator]]:bg-status-critical"
            : "[&_[data-slot=progress-indicator]]:bg-brand-accent",
        )}
      />
    </div>
  );
}
