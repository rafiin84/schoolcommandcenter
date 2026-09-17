"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { GeographicHierarchy, GeographyLevel } from "@/types";
import { boundsFor, project } from "@/lib/map-projection";
import { cn } from "@/lib/utils";

const HEALTH_FILL: Record<GeographicHierarchy["operationalHealth"], string> = {
  good: "var(--status-good)",
  watch: "var(--status-warning)",
  critical: "var(--status-critical)",
};

const RADIUS_BY_LEVEL: Record<GeographyLevel, number> = {
  state: 10,
  district: 10,
  block: 18,
  school: 14,
};

const WIDTH = 460;
const HEIGHT = 620;
const PADDING = 36;

export function EducationMapCanvas({
  nodes,
  currentLevel,
  selectedId,
  hoveredId,
  flaggedIds,
  onSelect,
  onHover,
}: {
  nodes: GeographicHierarchy[];
  currentLevel: GeographyLevel;
  selectedId: string | null;
  hoveredId: string | null;
  flaggedIds: Set<string>;
  onSelect: (node: GeographicHierarchy) => void;
  onHover: (id: string | null) => void;
}) {
  const bounds = useMemo(() => boundsFor(nodes), [nodes]);
  const radius = RADIUS_BY_LEVEL[currentLevel] ?? 13;
  const showFullLabels = nodes.length <= 12;

  const placed = useMemo(
    () =>
      nodes.map((node) => {
        const { x, y } = project(
          node,
          bounds,
          { width: WIDTH - PADDING * 2, height: HEIGHT - PADDING * 2 },
        );
        return { node, x: x + PADDING, y: y + PADDING };
      }),
    [nodes, bounds],
  );

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={`Schematic map of Tamil Nadu showing ${nodes.length} ${currentLevel === "district" ? "districts" : currentLevel === "block" ? "blocks" : "schools"}`}
    >
      <rect
        x={0}
        y={0}
        width={WIDTH}
        height={HEIGHT}
        rx={20}
        className="fill-surface-sunken"
      />

      {placed.map(({ node, x, y }) => {
        const isSelected = node.id === selectedId;
        const isHovered = node.id === hoveredId;
        const isFlagged = flaggedIds.has(node.id);

        return (
          <g
            key={node.id}
            transform={`translate(${x}, ${y})`}
            tabIndex={0}
            role="button"
            aria-label={`${node.name}, ${node.operationalHealth} operational health, ${node.engagementRate}% engagement`}
            aria-pressed={isSelected}
            onClick={() => onSelect(node)}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(node.id)}
            onBlur={() => onHover(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(node);
              }
            }}
            className="cursor-pointer outline-none"
          >
            <title>{`${node.name} — ${node.engagementRate}% engagement, ${node.onboardingProgress}% onboarding progress`}</title>
            {isSelected && (
              <motion.circle
                r={radius + 7}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
            <circle
              r={isHovered ? radius + 2 : radius}
              fill={HEALTH_FILL[node.operationalHealth]}
              fillOpacity={isHovered || isSelected ? 0.95 : 0.75}
              stroke="var(--card)"
              strokeWidth={2}
              className="transition-[r] duration-200 ease-out"
            />
            {isFlagged && (
              <circle
                cx={radius * 0.68}
                cy={-radius * 0.68}
                r={4.5}
                fill="var(--status-critical)"
                stroke="var(--card)"
                strokeWidth={1.5}
              />
            )}
            {(showFullLabels || isHovered || isSelected) && (
              <text
                y={radius + 13}
                textAnchor="middle"
                className="select-none fill-foreground text-[10px] font-medium"
              >
                {node.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
