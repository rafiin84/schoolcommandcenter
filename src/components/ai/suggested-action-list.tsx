import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function SuggestedActionList({ actions }: { actions: string[] }) {
  if (actions.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {actions.map((action) => (
        <li key={action} className="flex items-start gap-2 text-sm text-foreground">
          <ArrowRight size={14} weight="bold" className="mt-1 shrink-0 text-brand-accent" />
          <span>{action}</span>
        </li>
      ))}
    </ul>
  );
}
