import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

function GridIcon({ className }: { className?: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2.2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2.2" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="2.2" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="4.5" cy="6" r="1.8" />
      <circle cx="4.5" cy="12" r="1.8" />
      <circle cx="4.5" cy="18" r="1.8" />
      <rect x="9" y="4.8" width="12" height="2.4" rx="1.2" />
      <rect x="9" y="10.8" width="12" height="2.4" rx="1.2" />
      <rect x="9" y="16.8" width="12" height="2.4" rx="1.2" />
    </svg>
  );
}

/** Grid / list segmented pill from the Zoho Classes toolbars; the active view is indigo. */
export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (value: ViewMode) => void }) {
  const options: { mode: ViewMode; label: string; Icon: typeof GridIcon }[] = [
    { mode: "grid", label: "Grid view", Icon: GridIcon },
    { mode: "list", label: "List view", Icon: ListIcon },
  ];
  return (
    <div className="flex h-10 shrink-0 items-stretch overflow-hidden rounded-full border border-border bg-card" role="group" aria-label="View">
      {options.map(({ mode, label, Icon }, i) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          aria-label={label}
          title={label}
          aria-pressed={value === mode}
          className={cn(
            "flex w-12 items-center justify-center transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            i > 0 && "border-l border-border",
            value === mode ? "text-primary" : "text-foreground/80",
          )}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
