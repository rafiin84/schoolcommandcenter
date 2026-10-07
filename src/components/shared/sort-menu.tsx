"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type IconProps = { size?: number; className?: string };

/** Sort funnel from the Zoho Classes toolbars: three lines getting shorter. */
export function SortIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className} aria-hidden>
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

/** "Name" option: Z over A beside a list, as in Zoho Classes. */
export function SortNameIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3.5 4.5h4l-4 5h4M3.5 20v-5l2-3.5 2 3.5v5M3.5 17.5h4" strokeWidth={1.5} />
      <path d="M11 6h10M11 12h10M11 18h10" />
    </svg>
  );
}

/** "Created time" option: list lines with an up arrow. */
export function SortTimeIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 6h13M3 12h10M3 18h8" />
      <path d="M18 19V9M14.5 12.5 18 9l3.5 3.5" />
    </svg>
  );
}

export interface SortOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<IconProps>;
}

/** Round sort button with the Zoho Classes dropdown: icon + label rows, current one tinted. */
export function SortMenu<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: SortOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const current = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className={cn("size-10 rounded-full bg-card", className)}
            aria-label={`Sort by ${current?.label ?? ""}`}
            title="Sort"
          />
        }
      >
        <SortIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 min-w-52 p-0">
        {options.map((option) => {
          const Icon = option.icon ?? SortIcon;
          const selected = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                "gap-3 rounded-none px-4 py-3 text-sm",
                selected ? "bg-accent text-primary focus:bg-accent focus:text-primary" : "text-foreground",
              )}
            >
              <Icon size={20} />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
