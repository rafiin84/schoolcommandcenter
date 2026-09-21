"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { AlertException } from "@/types";
import { ALERT_CATEGORY_LABEL } from "@/lib/constants";
import { formatDate, geographyBreadcrumbLabel } from "@/lib/formatters";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { TargetVarianceIndicator } from "./target-variance-indicator";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<AlertException["status"], string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
};

const PRIORITY_ACCENT: Record<AlertException["priority"], string> = {
  low: "border-l-border bg-card",
  medium: "border-l-status-warning bg-status-warning/6",
  high: "border-l-status-serious bg-status-serious/6",
  critical: "border-l-status-critical bg-status-critical/6",
};

export function AlertCard({
  alert,
  compact = false,
}: {
  alert: AlertException;
  compact?: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
      <Link
        href={`/alerts/${alert.id}`}
        className={cn(
          "block rounded-2xl border border-l-4 border-border p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:p-5",
          PRIORITY_ACCENT[alert.priority],
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={13} />
            <span className="capitalize">{geographyBreadcrumbLabel(alert.geographyType)}</span>
            <span aria-hidden>·</span>
            <span>{ALERT_CATEGORY_LABEL[alert.category]}</span>
          </div>
          <PriorityBadge priority={alert.priority} />
        </div>

        <h3 className="mt-2 text-sm font-semibold text-foreground">{alert.title}</h3>
        {!compact && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{alert.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <TargetVarianceIndicator
            metricName={alert.metricName}
            currentValue={alert.currentValue}
            targetValue={alert.targetValue}
          />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium",
                alert.status === "open" && "bg-status-critical/10 text-status-critical",
                alert.status === "acknowledged" && "bg-status-warning/15 text-foreground",
                alert.status === "resolved" && "bg-status-good/10 text-status-good",
              )}
            >
              {STATUS_LABEL[alert.status]}
            </span>
            {alert.dueAt && (
              <span className="flex items-center gap-1">
                <CalendarBlank size={13} />
                Due {formatDate(alert.dueAt)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
