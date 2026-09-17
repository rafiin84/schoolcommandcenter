import type { IconProps } from "@phosphor-icons/react";
import { Tray } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = Tray,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<IconProps>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface-sunken px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon size={22} />
      </span>
      <div className="max-w-sm space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
