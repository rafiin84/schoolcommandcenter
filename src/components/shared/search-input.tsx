import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/** Rounded pill search field, as in the Zoho Classes toolbars. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  ariaLabel = "Search",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center gap-3 rounded-full border border-border bg-card px-4 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
        className,
      )}
    >
      <MagnifyingGlass size={20} className="shrink-0 text-foreground/70" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
    </div>
  );
}
