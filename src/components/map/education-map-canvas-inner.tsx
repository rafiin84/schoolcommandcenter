"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import Supercluster from "supercluster";
import type { GeographicHierarchy, GeographyLevel } from "@/types";

const HEALTH_FILL: Record<GeographicHierarchy["operationalHealth"], string> = {
  good: "var(--status-good)",
  watch: "var(--status-warning)",
  critical: "var(--status-critical)",
};

const RADIUS_BY_LEVEL: Record<GeographyLevel, number> = {
  state: 9,
  district: 9,
  block: 11,
  school: 8,
};

interface ClusterPointProps {
  nodeId: string;
}

/** Fields supercluster injects onto a cluster feature's properties. */
interface SuperclusterInjectedProps {
  cluster?: boolean;
  cluster_id?: number;
  point_count?: number;
}

function markerIcon({
  color,
  size,
  ringed,
  flagged,
  count,
}: {
  color: string;
  size: number;
  ringed: boolean;
  flagged: boolean;
  count?: number;
}) {
  const ring = ringed
    ? `box-shadow: 0 0 0 3px var(--primary), 0 0 0 5px color-mix(in srgb, var(--primary) 35%, transparent);`
    : "";
  const flag = flagged
    ? `<span style="position:absolute;top:-3px;right:-3px;width:9px;height:9px;border-radius:50%;background:var(--status-critical);border:1.5px solid var(--card);"></span>`
    : "";
  const badge = count
    ? `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:600;">${count}</span>`
    : "";

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size * 2}px;height:${size * 2}px;border-radius:50%;background:${color};opacity:0.9;border:2px solid var(--card);${ring}">${badge}${flag}</div>`,
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  });
}

function FitBoundsOnChange({ points }: { points: { latitude: number; longitude: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 9);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);
  return null;
}

function ClusterLayer({
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
  const map = useMap();
  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const index = useMemo(() => {
    const sc = new Supercluster<ClusterPointProps>({ radius: 48, maxZoom: 16 });
    sc.load(
      nodes.map((node) => ({
        type: "Feature",
        properties: { nodeId: node.id },
        geometry: { type: "Point", coordinates: [node.longitude, node.latitude] },
      })),
    );
    return sc;
  }, [nodes]);

  const [zoom, setZoom] = useState(() => map.getZoom());
  const [bbox, setBbox] = useState<[number, number, number, number]>(() => {
    const b = map.getBounds();
    return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
  });

  useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      setBbox([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
      setZoom(map.getZoom());
    },
    zoomend: () => setZoom(map.getZoom()),
  });

  const clusters = useMemo(
    () => index.getClusters(bbox, Math.round(zoom)),
    [index, bbox, zoom],
  );

  const radius = RADIUS_BY_LEVEL[currentLevel] ?? 9;

  return (
    <>
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const props = cluster.properties as ClusterPointProps & SuperclusterInjectedProps;
        const isCluster = Boolean(props.cluster);

        if (isCluster) {
          const count = props.point_count ?? 0;
          const clusterId = props.cluster_id ?? 0;
          return (
            <Marker
              key={`cluster-${clusterId}`}
              position={[lat, lng]}
              icon={markerIcon({ color: "var(--primary)", size: 14 + Math.min(count, 40) / 4, ringed: false, flagged: false, count })}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(index.getClusterExpansionZoom(clusterId), 16);
                  map.setView([lat, lng], expansionZoom, { animate: true });
                },
              }}
            />
          );
        }

        const node = nodesById.get(props.nodeId);
        if (!node) return null;
        const isSelected = node.id === selectedId;
        const isHovered = node.id === hoveredId;

        return (
          <Marker
            key={node.id}
            position={[lat, lng]}
            icon={markerIcon({
              color: HEALTH_FILL[node.operationalHealth],
              size: isHovered || isSelected ? radius + 2 : radius,
              ringed: isSelected,
              flagged: flaggedIds.has(node.id),
            })}
            eventHandlers={{
              click: () => onSelect(node),
              mouseover: () => onHover(node.id),
              mouseout: () => onHover(null),
            }}
          >
            <Tooltip direction="top" offset={[0, -radius]} opacity={1}>
              {node.name} — {node.engagementRate}% engagement, {node.onboardingProgress}% onboarding
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

export interface EducationMapCanvasProps {
  nodes: GeographicHierarchy[];
  currentLevel: GeographyLevel;
  selectedId: string | null;
  hoveredId: string | null;
  flaggedIds: Set<string>;
  onSelect: (node: GeographicHierarchy) => void;
  onHover: (id: string | null) => void;
}

export default function EducationMapCanvasInner({
  nodes,
  currentLevel,
  selectedId,
  hoveredId,
  flaggedIds,
  onSelect,
  onHover,
}: EducationMapCanvasProps) {
  const initialCenter = useRef<[number, number]>([
    nodes[0]?.latitude ?? 11.1271,
    nodes[0]?.longitude ?? 78.6569,
  ]);

  return (
    <div
      className="h-full w-full"
      role="img"
      aria-label={`Map of Tamil Nadu showing ${nodes.length} ${currentLevel === "district" ? "districts" : currentLevel === "block" ? "blocks" : "schools"}`}
    >
      <MapContainer
        center={initialCenter.current}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsOnChange points={nodes} />
        <ClusterLayer
          nodes={nodes}
          currentLevel={currentLevel}
          selectedId={selectedId}
          hoveredId={hoveredId}
          flaggedIds={flaggedIds}
          onSelect={onSelect}
          onHover={onHover}
        />
      </MapContainer>
    </div>
  );
}
