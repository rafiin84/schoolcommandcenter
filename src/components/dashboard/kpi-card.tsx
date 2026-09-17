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
}

export function KpiCard({ label, value, helpText, trend, icon: Icon, href }: KpiCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;

  const content = (
    <motion.div
      whileHover={href ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow",
        href && "cursor-pointer hover:shadow-md",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
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
