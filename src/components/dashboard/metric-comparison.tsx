import { cn } from "@/lib/utils";

export function MetricComparison({
  metricName,
  currentValue,
  targetValue,
  maxScale,
}: {
  metricName: string;
  currentValue: number;
  targetValue: number;
  maxScale?: number;
}) {
  const scale = maxScale ?? (Math.max(currentValue, targetValue) * 1.15 || 100);
  const currentPct = Math.min(100, (currentValue / scale) * 100);
  const targetPct = Math.min(100, (targetValue / scale) * 100);
  const isBehind = currentValue < targetValue;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">{metricName}</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Current</span>
          <span className="text-data font-semibold text-foreground">{currentValue}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", isBehind ? "bg-status-critical" : "bg-status-good")}
            style={{ width: `${currentPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Illustrative target</span>
          <span className="text-data font-semibold text-foreground">{targetValue}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-foreground/30" style={{ width: `${targetPct}%` }} />
        </div>
      </div>
    </div>
  );
}
