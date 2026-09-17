/**
 * A minimal equirectangular-style projection used to lay out the schematic
 * Tamil Nadu map. It is deliberately simple (linear lat/long scaling, not a
 * survey-grade projection) — good enough to preserve the state's real
 * relative geography for a schematic visualization, not for precise GIS use.
 */

export interface LatLngBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function boundsFor(points: { latitude: number; longitude: number }[]): LatLngBounds {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latPad = Math.max((maxLat - minLat) * 0.12, 0.05);
  const lngPad = Math.max((maxLng - minLng) * 0.12, 0.05);

  return {
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
  };
}

export function project(
  point: { latitude: number; longitude: number },
  bounds: LatLngBounds,
  viewport: { width: number; height: number },
): { x: number; y: number } {
  const latSpan = bounds.maxLat - bounds.minLat || 1;
  const lngSpan = bounds.maxLng - bounds.minLng || 1;

  const x = ((point.longitude - bounds.minLng) / lngSpan) * viewport.width;
  const y = ((bounds.maxLat - point.latitude) / latSpan) * viewport.height;

  return { x, y };
}
