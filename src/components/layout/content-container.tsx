import { cn } from "@/lib/utils";

export function ContentContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full px-3 py-6 sm:px-4 lg:px-4 lg:py-8", className)}>
      {children}
    </div>
  );
}
