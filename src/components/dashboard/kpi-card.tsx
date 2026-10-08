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

export function KpiCard({ label, value, helpText, trend, icon: Icon, href, tone, variant = "tile" }: KpiCardProps & { variant?: "tile" | "banner" }) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  void tone;
  const toneStyle = TILE;

  const content = variant === "banner" ? (
    <motion.div
      whileHover={href ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "relative flex h-full min-h-40 flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#7b46c8] p-6 text-white transition-shadow",
        href && "cursor-pointer hover:shadow-lg",
      )}
    >
      {Icon && (
        <Icon
          size={132}
          weight="fill"
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-4 text-white/15"
        />
      )}
      <p className="relative text-xl font-semibold leading-tight">{label}</p>
      <p className="relative mt-3 text-3xl font-bold tabular-nums">{value}</p>
      {(helpText || trend) && (
        <div className="relative mt-auto max-w-[70%] space-y-1 pt-3">
          {helpText && <p className="text-sm leading-snug text-white/85">{helpText}</p>}
          {trend && TrendIcon && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white">
              <TrendIcon size={12} weight="bold" />
              {trend.label}
            </span>
          )}
        </div>
      )}
    </motion.div>
  ) : (
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
      <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
