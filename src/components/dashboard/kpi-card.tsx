"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp } from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { TrendDirection } from "@/types";
import { cn } from "@/lib/utils";

const TREND_ICON: Record<TrendDirection, React.ComponentType<IconProps>> = {
  up: ArrowUp,
  down: ArrowDown,
  flat: ArrowRight,
};

const TREND_TONE: Record<TrendDirection, string> = {
  up: "text-status-good",
  down: "text-status-critical",
  flat: "text-muted-foreground",
};

export type KpiTone = "blue" | "orange" | "green" | "amber" | "pink" | "teal" | "red" | "navy";

const TONE_STYLES: Record<KpiTone, { card: string; icon: string }> = {
  blue: { card: "bg-chart-1/8 border-chart-1/20", icon: "bg-chart-1/15 text-chart-1" },
  orange: { card: "bg-chart-2/8 border-chart-2/20", icon: "bg-chart-2/15 text-chart-2" },
  green: { card: "bg-chart-3/8 border-chart-3/20", icon: "bg-chart-3/15 text-chart-3" },
  amber: { card: "bg-chart-4/8 border-chart-4/20", icon: "bg-chart-4/15 text-chart-4" },
  pink: { card: "bg-chart-5/8 border-chart-5/20", icon: "bg-chart-5/15 text-chart-5" },
  teal: { card: "bg-brand-accent/8 border-brand-accent/20", icon: "bg-brand-accent/15 text-brand-accent" },
  red: { card: "bg-status-critical/8 border-status-critical/20", icon: "bg-status-critical/15 text-status-critical" },
  navy: { card: "bg-primary/8 border-primary/20", icon: "bg-primary/15 text-primary" },
};

export interface KpiCardProps {
  label: string;
  value: string;
  helpText?: string;
  trend?: {
    direction: TrendDirection;
    label: string;
  };
  icon?: React.ComponentType<IconProps>;
  href?: string;
  tone?: KpiTone;
}

export function KpiCard({ label, value, helpText, trend, icon: Icon, href, tone }: KpiCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  const toneStyle = tone ? TONE_STYLES[tone] : null;

  const content = (
    <motion.div
      whileHover={href ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl border p-5 shadow-sm transition-shadow",
        toneStyle ? toneStyle.card : "border-border bg-card",
        href && "cursor-pointer hover:shadow-md",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              toneStyle ? toneStyle.icon : "bg-muted text-muted-foreground",
            )}
          >
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="text-kpi">{value}</p>
      <div className="flex items-center justify-between gap-2">
        {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
        {trend && TrendIcon && (
          <span className={cn("inline-flex items-center gap-1 text-xs font-medium", TREND_TONE[trend.direction])}>
            <TrendIcon size={12} weight="bold" />
            {trend.label}
          </span>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
