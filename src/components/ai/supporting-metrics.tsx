import type { SupportingMetric } from "@/types";

export function SupportingMetrics({ metrics }: { metrics: SupportingMetric[] }) {
  if (metrics.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border border-border bg-background px-3 py-2">
          <p className="truncate text-xs text-muted-foreground">{metric.label}</p>
          <p className="text-data font-semibold text-foreground">{metric.value}</p>
          {metric.changeLabel && (
            <p className="text-[11px] text-muted-foreground">{metric.changeLabel}</p>
          )}
        </div>
      ))}
    </div>
  );
}
