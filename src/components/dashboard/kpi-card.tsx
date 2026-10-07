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

const TILE = { card: "bg-accent", icon: "text-primary" };

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
  void tone;
  const toneStyle = TILE;

  const content = (
    <motion.div
      whileHover={href ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg p-4 transition-shadow",
        toneStyle.card,
        href && "cursor-pointer hover:shadow-md",
      )}
    >
      {Icon && (
        <span className={cn("flex size-7 shrink-0 items-center", toneStyle.icon)}>
          <Icon size={24} weight="fill" />
        </span>
      )}
      <div className="mt-2 space-y-1">
        <p className="text-xl font-semibold tabular-nums text-foreground">{value}</p>
        <span className="block text-sm text-muted-foreground">{label}</span>
      </div>
      {(helpText || trend) && (
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
          {trend && TrendIcon && (
            <span className={cn("inline-flex items-center gap-1 text-xs font-medium", TREND_TONE[trend.direction])}>
              <TrendIcon size={12} weight="bold" />
              {trend.label}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
