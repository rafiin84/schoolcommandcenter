"use client";

import dynamic from "next/dynamic";
import type { EducationMapCanvasProps } from "./education-map-canvas-inner";

/**
 * Leaflet touches `window`/`document` at module import time, which breaks
 * Next.js's server-side render of this ("use client") module tree. Deferring
 * the import itself (not just the render) via next/dynamic + ssr:false keeps
 * the `leaflet` package out of the server bundle evaluation entirely.
 */
const EducationMapCanvasInner = dynamic(() => import("./education-map-canvas-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function EducationMapCanvas(props: EducationMapCanvasProps) {
  return <EducationMapCanvasInner {...props} />;
}
