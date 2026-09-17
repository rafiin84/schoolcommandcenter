import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export function MockInsightBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-badge inline-flex items-center gap-1 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-2 py-0.5 text-brand-accent",
        className,
      )}
    >
      <Sparkle size={11} weight="fill" />
      Mock insight
    </span>
  );
}

export function MockInsightDisclaimer({ text }: { text: string }) {
  return (
    <p className="rounded-lg bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">
      {text}
    </p>
  );
}
