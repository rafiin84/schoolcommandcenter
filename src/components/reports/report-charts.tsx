"use client";

import { useId, useState } from "react";
import { Table } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/layout/section-header";
import { formatNumber, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { ChartDatum } from "./report-metrics";

const DEFAULT_COLOR = "var(--primary)";

/**
 * Soft tint of a series colour, mixed toward the card surface. Marks rest at this
 * light tint and step up to the full colour on hover/focus. Values stay readable
 * without the colour: every mark is direct-labelled and every chart has a table view.
 */
export function tint(color: string, strength = 45): string {
  return `color-mix(in oklab, ${color} ${strength}%, var(--card))`;
}

/** Rounds the axis top up to a clean 1 / 2 / 5 step so ticks read as whole numbers. */
function niceScale(max: number, target = 4): { top: number; ticks: number[] } {
  if (max <= 0) return { top: 1, ticks: [0, 1] };
  const raw = max / target;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? pow * 10);
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step) };
}

// 4px rounded data-end, square at the baseline.
function columnPath(x: number, y: number, w: number, h: number, r = 4): string {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

interface TooltipState {
  x: number; // % of chart width
  y: number; // % of chart height
  title: string;
  rows: { label: string; value: string; color: string }[];
}

function ChartTooltip({ tip }: { tip: TooltipState | null }) {
  if (!tip) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md"
      style={{
        left: `${tip.x}%`,
        top: `${tip.y}%`,
        transform: `translate(${tip.x > 60 ? "calc(-100% - 8px)" : "8px"}, -50%)`,
      }}
    >
      <p className="mb-1 text-muted-foreground">{tip.title}</p>
      {tip.rows.map((row) => (
        <p key={row.label} className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: row.color }} aria-hidden />
          <span className="font-semibold text-foreground">{row.value}</span>
          {row.label !== tip.title && <span className="text-muted-foreground">{row.label}</span>}
        </p>
      ))}
    </div>
  );
}

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground"
        >
          <span className="size-2 rounded-sm" style={{ backgroundColor: tint(item.color) }} aria-hidden />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Card shell shared by every chart: heading, optional legend, and a table-view twin. */
export function ChartCard({
  title,
  description,
  legend,
  icon,
  table,
  children,
  className,
}: {
  title: string;
  description?: string;
  legend?: React.ReactNode;
  /** Optional icon chip shown beside the table toggle. */
  icon?: React.ReactNode;
  table: { columns: [string, string]; rows: ChartDatum[] };
  children: React.ReactNode;
  className?: string;
}) {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className={cn("flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-6", className)}>
      <SectionHeader
        title={title}
        description={description}
        actions={
          <>
            {icon}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setShowTable((v) => !v)}
              aria-pressed={showTable}
            >
              <Table size={14} />
              {showTable ? "View chart" : "View table"}
            </Button>
          </>
        }
      />
      {legend && !showTable && <div className="mb-3">{legend}</div>}
      <div className="flex flex-1 flex-col justify-center">
        {showTable ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">{table.columns[0]}</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">{table.columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="px-3 py-2">{row.label}</td>
                    <td className="text-data px-3 py-2 text-right">{formatNumber(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

const COL_PADDING = { top: 16, right: 8, bottom: 32, left: 32 };

export function ColumnChart({
  data,
  color = DEFAULT_COLOR,
  unit,
  width = 520,
  height = 260,
  compact = false,
}: {
  data: ChartDatum[];
  color?: string;
  unit: string;
  width?: number;
  height?: number;
  /** Small-multiple mode: label only non-zero columns and thin out the x-axis. */
  compact?: boolean;
}) {
  const COL = { ...COL_PADDING, width, height };
  const [active, setActive] = useState<number | null>(null);
  const { top, ticks } = niceScale(Math.max(...data.map((d) => d.value)) * 1.2);
  const innerW = COL.width - COL.left - COL.right;
  const innerH = COL.height - COL.top - COL.bottom;
  const band = innerW / data.length;
  const barW = Math.min(24, band * 0.5);
  const labelEvery = compact ? Math.ceil(data.length / 6) : 1;
  const y = (v: number) => COL.top + innerH - (v / top) * innerH;

  const tip: TooltipState | null =
    active === null
      ? null
      : {
          x: ((COL.left + band * active + band / 2) / COL.width) * 100,
          y: (y(data[active].value) / COL.height) * 100,
          title: data[active].label,
          rows: [{ label: unit, value: formatNumber(data[active].value), color }],
        };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${COL.width} ${COL.height}`} className="w-full" role="img" aria-label={`Column chart of ${unit} by category`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={COL.left} x2={COL.width - COL.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
            <text x={COL.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[11px] tabular-nums">
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = COL.left + band * i + band / 2;
          const h = (d.value / top) * innerH;
          return (
            <g key={d.label}>
              {h > 0 && (
                <path
                  d={columnPath(cx - barW / 2, y(d.value), barW, h)}
                  style={{ fill: active === i ? color : tint(color) }}
                  className="transition-[fill]"
                />
              )}
              {(!compact || d.value > 0) && (
                <text x={cx} y={y(d.value) - 6} textAnchor="middle" className="fill-foreground text-[13px] font-semibold">
                  {d.value}
                </text>
              )}
              {(data.length - 1 - i) % labelEvery === 0 && (
                <text x={cx} y={COL.height - 10} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                  {d.shortLabel ?? d.label}
                </text>
              )}
              <rect
                x={COL.left + band * i}
                y={COL.top}
                width={band}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                aria-label={`${d.label}: ${d.value} ${unit}`}
                className="cursor-pointer outline-none"
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            </g>
          );
        })}
      </svg>
      <ChartTooltip tip={tip} />
    </div>
  );
}

export function BarChart({ data, unit }: { data: ChartDatum[]; unit: string }) {
  const [active, setActive] = useState<number | null>(null);
  const { top, ticks } = niceScale(Math.max(...data.map((d) => d.value)));

  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div
          key={d.label}
          tabIndex={0}
          aria-label={`${d.label}: ${d.value} ${unit}`}
          className="group relative grid grid-cols-[7.5rem_1fr] items-center gap-3 rounded-md py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          onPointerEnter={() => setActive(i)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
        >
          <span className="truncate text-xs text-muted-foreground" title={d.label}>
            {d.label}
          </span>
          <div className="relative flex h-6 items-center">
            {ticks.map((t) => (
              <span
                key={t}
                aria-hidden
                className="absolute inset-y-0 w-px bg-border"
                style={{ left: `${(t / top) * 100}%` }}
              />
            ))}
            <span
              className="relative h-3 rounded-r-[4px] transition-opacity"
              style={{
                width: `${(d.value / top) * 100}%`,
                backgroundColor: active === i ? (d.color ?? DEFAULT_COLOR) : tint(d.color ?? DEFAULT_COLOR),
              }}
            />
            <span className="relative ml-2 text-xs font-semibold text-foreground">{formatNumber(d.value)}</span>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[7.5rem_1fr] gap-3">
        <span />
        <div className="relative h-4">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 text-[10px] tabular-nums text-muted-foreground"
              style={{ left: `${(t / top) * 100}%` }}
            >
              {formatNumber(t)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DonutChart({ data, centerLabel }: { data: ChartDatum[]; centerLabel: string }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 200;
  const stroke = 26;
  const r = (size - stroke) / 2 - 4;
  const circumference = 2 * Math.PI * r;
  const gap = 2;

  let offset = 0;
  const segments = data.map((d) => {
    const length = total > 0 ? (d.value / total) * circumference : 0;
    const segment = { ...d, length, offset };
    offset += length;
    return segment;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
      <div className="relative size-48 shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90" role="img" aria-label={`Donut chart, ${total} ${centerLabel}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
          {segments.map((s, i) => (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              style={{ stroke: active === i ? (s.color ?? DEFAULT_COLOR) : tint(s.color ?? DEFAULT_COLOR) }}
              strokeWidth={active === i ? stroke + 6 : stroke}
              strokeDasharray={`${Math.max(s.length - gap, 0)} ${circumference}`}
              strokeDashoffset={-s.offset}
              tabIndex={0}
              aria-label={`${s.label}: ${s.value}`}
              className="cursor-pointer outline-none transition-all"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold tracking-tight text-foreground">
            {formatNumber(active === null ? total : data[active].value)}
          </span>
          <span className="text-xs text-muted-foreground">{active === null ? centerLabel : data[active].label}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {data.map((d, i) => (
          <li
            key={d.label}
            className={cn(
              "flex min-w-40 items-center gap-3 rounded-xl border border-border px-3 py-2 transition-opacity",
              active !== null && active !== i && "opacity-50",
            )}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
          >
            <span className="size-3 rounded-sm" style={{ backgroundColor: tint(d.color ?? DEFAULT_COLOR) }} aria-hidden />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{d.label}</p>
              <p className="text-lg font-semibold text-foreground">{formatNumber(d.value)}</p>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {formatPercent(total > 0 ? (d.value / total) * 100 : 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const AREA = { width: 1100, height: 240, top: 16, right: 16, bottom: 28, left: 32 };

export function AreaChart({ data, unit, color = DEFAULT_COLOR }: { data: ChartDatum[]; unit: string; color?: string }) {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);
  const { top, ticks } = niceScale(Math.max(...data.map((d) => d.value)));
  const innerW = AREA.width - AREA.left - AREA.right;
  const innerH = AREA.height - AREA.top - AREA.bottom;
  const x = (i: number) => AREA.left + (data.length <= 1 ? 0 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => AREA.top + innerH - (v / top) * innerH;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`).join(" ");
  const area = `${line} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const tip: TooltipState | null =
    active === null
      ? null
      : {
          x: (x(active) / AREA.width) * 100,
          y: (y(data[active].value) / AREA.height) * 100,
          title: data[active].label,
          rows: [{ label: unit, value: formatNumber(data[active].value), color }],
        };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${AREA.width} ${AREA.height}`}
        className="w-full"
        role="img"
        aria-label={`Area chart of ${unit} per month`}
        tabIndex={0}
        onPointerLeave={() => setActive(null)}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const relX = ((event.clientX - rect.left) / rect.width) * AREA.width;
          const index = Math.round(((relX - AREA.left) / innerW) * (data.length - 1));
          setActive(Math.min(Math.max(index, 0), data.length - 1));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") setActive((a) => Math.min((a ?? -1) + 1, data.length - 1));
          if (event.key === "ArrowLeft") setActive((a) => Math.max((a ?? data.length) - 1, 0));
        }}
        onBlur={() => setActive(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.14 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.02 }} />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={AREA.left} x2={AREA.width - AREA.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
            <text x={AREA.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[10px] tabular-nums">
              {t}
            </text>
          </g>
        ))}
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" style={{ stroke: tint(color, 70) }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {active !== null && (
          <>
            <line x1={x(active)} x2={x(active)} y1={AREA.top} y2={y(0)} stroke="var(--muted-foreground)" strokeWidth={1} />
            <circle cx={x(active)} cy={y(data[active].value)} r={4.5} fill={color} stroke="var(--card)" strokeWidth={2} />
          </>
        )}
        {data.map((d, i) => (
          <text key={d.label} x={x(i)} y={AREA.height - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
            {d.shortLabel ?? d.label}
          </text>
        ))}
      </svg>
      <ChartTooltip tip={tip} />
    </div>
  );
}
