"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CaretDown,
  ChartLineUp,
  MapTrifold,
  ShieldWarning,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { AiInsight, InsightType } from "@/types";
import { MockInsightBadge, MockInsightDisclaimer } from "./mock-insight-disclaimer";
import { SupportingMetrics } from "./supporting-metrics";
import { SuggestedActionList } from "./suggested-action-list";
import { cn } from "@/lib/utils";

const INSIGHT_ICON: Record<InsightType, React.ComponentType<IconProps>> = {
  deployment_gap: MapTrifold,
  engagement_pattern: ChartLineUp,
  operational_risk: ShieldWarning,
  positive_trend: TrendUp,
};

const INSIGHT_ACCENT: Record<InsightType, { card: string; icon: string }> = {
  deployment_gap: { card: "bg-chart-1/5", icon: "bg-chart-1/10 text-chart-1" },
  engagement_pattern: { card: "bg-chart-5/5", icon: "bg-chart-5/10 text-chart-5" },
  operational_risk: { card: "bg-status-critical/5", icon: "bg-status-critical/10 text-status-critical" },
  positive_trend: { card: "bg-status-good/5", icon: "bg-status-good/10 text-status-good" },
};

export function AiInsightCard({
  insight,
  defaultExpanded = false,
}: {
  insight: AiInsight;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentId = useId();
  const Icon = INSIGHT_ICON[insight.insightType];
  const accent = INSIGHT_ACCENT[insight.insightType];

  return (
    <div className={`rounded-2xl p-4 sm:p-5 ${accent.card}`}>
      <div className="flex items-start gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${accent.icon}`}>
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
            <MockInsightBadge />
          </div>
          <p className="text-sm text-muted-foreground">{insight.summary}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={contentId}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <CaretDown size={16} />
          </motion.span>
          <span className="sr-only">{expanded ? "Collapse insight" : "Expand insight"}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="overflow-hidden"
          >
            <div className={cn("mt-4 flex flex-col gap-4 border-t border-border pt-4")}>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Supporting metrics
                </p>
                <SupportingMetrics metrics={insight.supportingMetrics} />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reasoning context
                </p>
                <p className="text-sm text-foreground">{insight.reasoningContext}</p>
                <p className="mt-1 text-xs text-muted-foreground">{insight.confidenceContext}</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Suggested follow-up
                </p>
                <SuggestedActionList actions={insight.suggestedActions} />
              </div>
              <MockInsightDisclaimer text={insight.disclaimer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
