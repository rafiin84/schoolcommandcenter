import { cn } from "@/lib/utils";

export function TargetVarianceIndicator({
  metricName,
  currentValue,
  targetValue,
  className,
}: {
  metricName: string;
  currentValue: number;
  targetValue: number;
  className?: string;
}) {
  const variance = currentValue - targetValue;
  const isBehind = variance < 0;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs text-muted-foreground">{metricName}</span>
      <span className="text-data flex items-baseline gap-1.5">
        <span className="font-semibold text-foreground">{currentValue}</span>
        <span className="text-xs text-muted-foreground">vs target {targetValue}</span>
        <span
          className={cn(
            "text-xs font-medium",
            isBehind ? "text-status-critical" : "text-status-good",
          )}
        >
          ({isBehind ? "" : "+"}
          {variance})
        </span>
      </span>
    </div>
  );
}
