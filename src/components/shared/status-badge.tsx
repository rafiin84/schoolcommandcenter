import {
  CheckCircle,
  Circle,
  Clock,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { OnboardingStatus, OperationalHealth } from "@/types";
import { ONBOARDING_STATUS_LABEL, OPERATIONAL_HEALTH_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StatusTone = "good" | "warning" | "critical" | "info" | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  good: "bg-status-good/10 border-status-good/25 text-foreground",
  warning: "bg-status-warning/15 border-status-warning/30 text-foreground",
  critical: "bg-status-critical/10 border-status-critical/25 text-foreground",
  info: "bg-status-info/10 border-status-info/25 text-foreground",
  neutral: "bg-muted border-border text-muted-foreground",
};

const TONE_ICON_CLASSES: Record<StatusTone, string> = {
  good: "text-status-good",
  warning: "text-status-warning",
  critical: "text-status-critical",
  info: "text-status-info",
  neutral: "text-muted-foreground",
};

const TONE_ICON: Record<StatusTone, React.ComponentType<IconProps>> = {
  good: CheckCircle,
  warning: WarningCircle,
  critical: WarningCircle,
  info: Circle,
  neutral: Clock,
};

function baseBadge(tone: StatusTone, label: string, className?: string) {
  const Icon = TONE_ICON[tone];
  return (
    <span
      className={cn(
        "text-badge inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <Icon size={13} weight="fill" aria-hidden className={TONE_ICON_CLASSES[tone]} />
      {label}
    </span>
  );
}

const OPERATIONAL_HEALTH_TONE: Record<OperationalHealth, StatusTone> = {
  good: "good",
  watch: "warning",
  critical: "critical",
};

const ONBOARDING_STATUS_TONE: Record<OnboardingStatus, StatusTone> = {
  onboarded: "good",
  in_progress: "info",
  at_risk: "warning",
  not_started: "neutral",
};

export function OperationalHealthBadge({
  health,
  className,
}: {
  health: OperationalHealth;
  className?: string;
}) {
  return baseBadge(OPERATIONAL_HEALTH_TONE[health], OPERATIONAL_HEALTH_LABEL[health], className);
}

export function OnboardingStatusBadge({
  status,
  className,
}: {
  status: OnboardingStatus;
  className?: string;
}) {
  return baseBadge(ONBOARDING_STATUS_TONE[status], ONBOARDING_STATUS_LABEL[status], className);
}
