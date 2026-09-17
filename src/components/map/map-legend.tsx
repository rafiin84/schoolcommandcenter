export function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">Operational health:</span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-status-good" /> Healthy
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-status-warning" /> Needs watching
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-status-critical" /> Critical
      </span>
      <span className="ml-auto text-muted-foreground">Click a region to drill in</span>
    </div>
  );
}
