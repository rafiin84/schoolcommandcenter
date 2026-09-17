"use client";

import { useId, useMemo, useState } from "react";
import { Table } from "@phosphor-icons/react/dist/ssr";
import type { KpiMetricKey, KpiTrendSeries } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const SERIES_COLOR: Record<KpiMetricKey, string> = {
  deployment: "var(--chart-1)",
  engagement: "var(--chart-2)",
  operationalHealth: "var(--chart-3)",
};

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 16, right: 12, bottom: 28, left: 32 };

const RANGE_OPTIONS = [
  { label: "Last 6 weeks", weeks: 6 },
  { label: "Last 14 weeks", weeks: 14 },
] as const;

export function TrendChart({ series }: { series: KpiTrendSeries[] }) {
  const gradientId = useId();
  const [visible, setVisible] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(series.map((s) => [s.metric, true])),
  );
  const [rangeWeeks, setRangeWeeks] = useState<number>(14);
  const [showTable, setShowTable] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const slicedSeries = useMemo(
    () =>
      series.map((s) => ({
        ...s,
        points: s.points.slice(Math.max(0, s.points.length - rangeWeeks)),
      })),
    [series, rangeWeeks],
  );

  const activeSeries = slicedSeries.filter((s) => visible[s.metric]);
  const pointCount = slicedSeries[0]?.points.length ?? 0;

  const { xForIndex, yForValue } = useMemo(() => {
    const innerWidth = WIDTH - PADDING.left - PADDING.right;
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
    return {
      xForIndex: (index: number) =>
        PADDING.left + (pointCount <= 1 ? 0 : (index / (pointCount - 1)) * innerWidth),
      yForValue: (value: number) =>
        PADDING.top + innerHeight - (value / 100) * innerHeight,
    };
  }, [pointCount]);

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {series.map((s) => {
            const isVisible = visible[s.metric];
            return (
              <button
                key={s.metric}
                type="button"
                onClick={() =>
                  setVisible((prev) => ({ ...prev, [s.metric]: !prev[s.metric] }))
                }
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  isVisible
                    ? "border-border bg-card text-foreground"
                    : "border-transparent bg-transparent text-muted-foreground/50",
                )}
                aria-pressed={isVisible}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: SERIES_COLOR[s.metric] }}
                  aria-hidden
                />
                {s.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border p-0.5">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.weeks}
                type="button"
                onClick={() => setRangeWeeks(option.weeks)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  rangeWeeks === option.weeks
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
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
        </div>
      </div>

      {showTable ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Week of</th>
                {slicedSeries.map((s) => (
                  <th key={s.metric} scope="col" className="px-3 py-2 font-medium">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slicedSeries[0]?.points.map((point, index) => (
                <tr key={point.date} className="border-t border-border">
                  <td className="text-data px-3 py-2">{formatDate(point.date)}</td>
                  {slicedSeries.map((s) => (
                    <td key={s.metric} className="text-data px-3 py-2">
                      {s.points[index]?.value ?? "—"}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full"
            role="img"
            aria-label="Line chart showing trend for the selected metrics over time"
            onMouseLeave={() => setHoverIndex(null)}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;
              const innerWidth = WIDTH - PADDING.left - PADDING.right;
              const ratio = (relativeX - PADDING.left) / innerWidth;
              const index = Math.round(ratio * (pointCount - 1));
              setHoverIndex(Math.min(Math.max(index, 0), pointCount - 1));
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.16} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>

            {gridLines.map((line) => (
              <g key={line}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={yForValue(line)}
                  y2={yForValue(line)}
                  stroke="var(--border)"
                  strokeWidth={1}
                />
                <text
                  x={PADDING.left - 8}
                  y={yForValue(line)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  {line}
                </text>
              </g>
            ))}

            {hoverIndex !== null && (
              <line
                x1={xForIndex(hoverIndex)}
                x2={xForIndex(hoverIndex)}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="var(--muted-foreground)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}

            {activeSeries.map((s) => {
              const path = s.points
                .map((p, i) => `${i === 0 ? "M" : "L"} ${xForIndex(i)} ${yForValue(p.value)}`)
                .join(" ");
              return (
                <g key={s.metric}>
                  <path
                    d={path}
                    fill="none"
                    stroke={SERIES_COLOR[s.metric]}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {hoverIndex !== null && s.points[hoverIndex] && (
                    <circle
                      cx={xForIndex(hoverIndex)}
                      cy={yForValue(s.points[hoverIndex].value)}
                      r={4}
                      fill={SERIES_COLOR[s.metric]}
                      stroke="var(--card)"
                      strokeWidth={2}
                    />
                  )}
                </g>
              );
            })}

            {Array.from({ length: pointCount }).map((_, i) =>
              i % Math.ceil(pointCount / 5) === 0 ? (
                <text
                  key={i}
                  x={xForIndex(i)}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  {formatDate(slicedSeries[0].points[i].date).replace(/, \d{4}/, "")}
                </text>
              ) : null,
            )}
          </svg>

          {hoverIndex !== null && slicedSeries[0]?.points[hoverIndex] && (
            <div
              className="pointer-events-none absolute top-2 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md"
              style={{
                left: `${(xForIndex(hoverIndex) / WIDTH) * 100}%`,
                transform:
                  hoverIndex > pointCount / 2 ? "translateX(-105%)" : "translateX(8px)",
              }}
            >
              <p className="mb-1 font-medium text-foreground">
                {formatDate(slicedSeries[0].points[hoverIndex].date)}
              </p>
              {activeSeries.map((s) => (
                <p key={s.metric} className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: SERIES_COLOR[s.metric] }}
                  />
                  {s.label}: <span className="font-medium text-foreground">{s.points[hoverIndex]?.value}%</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
