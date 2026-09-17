"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListBullets, MapTrifold } from "@phosphor-icons/react/dist/ssr";
import type { GeographicHierarchy } from "@/types";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { GeographyBreadcrumbs } from "@/components/map/geography-breadcrumbs";
import { MapFilters } from "@/components/map/map-filters";
import { MapLegend } from "@/components/map/map-legend";
import { EducationMapCanvas } from "@/components/map/education-map-canvas";
import { GeographyListFallback } from "@/components/map/geography-list-fallback";
import { MapDetailPanel } from "@/components/map/map-detail-panel";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useEducationMapData } from "@/hooks/use-map";
import { useMapStore } from "@/store/map-store";
import { useScopeStore } from "@/store/scope-store";
import { useIsDesktop } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

function EducationMapContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");

  const scope = useScopeStore();
  const filters = useMapStore((s) => s.filters);
  const selectedEntityId = useMapStore((s) => s.selectedEntityId);
  const hoveredEntityId = useMapStore((s) => s.hoveredEntityId);
  const selectEntity = useMapStore((s) => s.selectEntity);
  const hoverEntity = useMapStore((s) => s.hoverEntity);

  const [view, setView] = useState<"map" | "list">("map");
  const [focusResolved, setFocusResolved] = useState(false);
  const isDesktop = useIsDesktop();

  const allNodes = useEducationMapData({});
  const filteredNodes = useEducationMapData({
    search: filters.search || undefined,
    priority: filters.priority.length > 0 ? filters.priority : undefined,
    onboardingStatus: filters.onboardingStatus.length > 0 ? filters.onboardingStatus : undefined,
    maxEngagement: filters.maxEngagement ?? undefined,
  });

  useEffect(() => {
    if (focusResolved || !focusId || !allNodes.data) return;
    const node = allNodes.data.data.find((n) => n.id === focusId);
    if (node) {
      if (node.level === "district") scope.setDistrictScope(node.id);
      else if (node.level === "block" && node.districtId) scope.setBlockScope(node.districtId, node.id);
      else if (node.level === "school" && node.districtId && node.blockId)
        scope.setSchoolScope(node.districtId, node.blockId, node.id);
      selectEntity(node.id);
    }
    setFocusResolved(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId, allNodes.data, focusResolved]);

  const currentLevelNodes = useMemo(() => {
    const data = filteredNodes.data?.data ?? [];
    if (scope.level === "state") return data.filter((n) => n.level === "district");
    if (scope.level === "district") return data.filter((n) => n.level === "block" && n.districtId === scope.districtId);
    return data.filter((n) => n.level === "school" && n.blockId === scope.blockId);
  }, [filteredNodes.data, scope.level, scope.districtId, scope.blockId]);

  const allDistricts = useMemo(
    () => (allNodes.data?.data ?? []).filter((n) => n.level === "district"),
    [allNodes.data],
  );
  const currentDistrict = allDistricts.find((d) => d.id === scope.districtId);
  const currentBlock = (allNodes.data?.data ?? []).find((n) => n.id === scope.blockId);

  const flaggedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const n of filteredNodes.data?.data ?? []) {
      if (n.operationalHealth === "critical" || n.status === "at_risk") ids.add(n.id);
    }
    return ids;
  }, [filteredNodes.data]);

  const selectedNode = (allNodes.data?.data ?? []).find((n) => n.id === selectedEntityId) ?? null;

  const crumbs = [
    { label: "Tamil Nadu", href: scope.level !== "state" ? "/education-map" : undefined },
    ...(currentDistrict
      ? [{ label: currentDistrict.name, href: scope.level !== "district" ? `/education-map?focus=${currentDistrict.id}` : undefined }]
      : []),
    ...(currentBlock ? [{ label: currentBlock.name }] : []),
  ].filter((c) => c.label);

  function handleSelect(node: GeographicHierarchy) {
    selectEntity(node.id);
    if (node.level === "district") {
      scope.setDistrictScope(node.id);
    } else if (node.level === "block" && node.districtId) {
      scope.setBlockScope(node.districtId, node.id);
    }
  }

  function goToState() {
    scope.setStateScope();
    selectEntity(null);
  }

  function goToDistrict() {
    if (scope.districtId) scope.setDistrictScope(scope.districtId);
    selectEntity(null);
  }

  return (
    <ContentContainer className="lg:max-w-none">
      <PageHeader
        eyebrow="Tamil Nadu"
        title="Education Map"
        description="Explore statewide deployment geographically — drill from districts into blocks and schools."
        actions={
          <div className="flex overflow-hidden rounded-full border border-border">
            <button
              type="button"
              onClick={() => setView("map")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                view === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
              aria-pressed={view === "map"}
            >
              <MapTrifold size={15} /> Map
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
                view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
              aria-pressed={view === "list"}
            >
              <ListBullets size={15} /> List
            </button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <GeographyBreadcrumbs
          crumbs={
            crumbs.length > 0
              ? crumbs.map((c, i) => ({
                  label: c.label,
                  href: i === 0 ? undefined : c.href,
                }))
              : [{ label: "Tamil Nadu" }]
          }
        />
        {scope.level !== "state" && (
          <div className="flex gap-2 text-xs">
            <Button variant="ghost" size="sm" onClick={goToState}>
              ← All districts
            </Button>
            {scope.level === "block" && (
              <Button variant="ghost" size="sm" onClick={goToDistrict}>
                ← Blocks in {currentDistrict?.name}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <MapFilters />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-3">
          <MapLegend />
          <div className="min-h-[520px] overflow-hidden rounded-2xl border border-border bg-card p-2">
            {filteredNodes.isLoading ? (
              <div className="flex h-[520px] items-center justify-center text-sm text-muted-foreground">
                Loading map data…
              </div>
            ) : filteredNodes.isError ? (
              <div className="p-6">
                <ErrorState onRetry={() => filteredNodes.refetch()} />
              </div>
            ) : currentLevelNodes.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No results for these filters"
                  description="Try clearing a filter or searching a different district, block, or school."
                />
              </div>
            ) : view === "map" ? (
              <EducationMapCanvas
                nodes={currentLevelNodes}
                currentLevel={scope.level === "state" ? "district" : scope.level === "district" ? "block" : "school"}
                selectedId={selectedEntityId}
                hoveredId={hoveredEntityId}
                flaggedIds={flaggedIds}
                onSelect={handleSelect}
                onHover={hoverEntity}
              />
            ) : (
              <div className="p-2">
                <GeographyListFallback
                  nodes={currentLevelNodes}
                  selectedId={selectedEntityId}
                  onSelect={handleSelect}
                />
              </div>
            )}
          </div>
        </div>

        <div className="hidden rounded-2xl border border-border bg-card lg:sticky lg:top-20 lg:block lg:max-h-[calc(100svh-6rem)] lg:min-h-[520px] lg:overflow-hidden">
          {selectedNode ? (
            <MapDetailPanel node={selectedNode} onClose={() => selectEntity(null)} />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <EmptyState
                title="Select a region"
                description="Click a district, block, or school to see its details here."
              />
            </div>
          )}
        </div>
      </div>

      {!isDesktop && (
        <Sheet open={Boolean(selectedNode)} onOpenChange={(open) => !open && selectEntity(null)}>
          <SheetContent side="bottom" className="h-[85svh] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>{selectedNode?.name ?? "Details"}</SheetTitle>
            </SheetHeader>
            {selectedNode && <MapDetailPanel node={selectedNode} onClose={() => selectEntity(null)} />}
          </SheetContent>
        </Sheet>
      )}
    </ContentContainer>
  );
}

export default function EducationMapPage() {
  return (
    <Suspense fallback={null}>
      <EducationMapContent />
    </Suspense>
  );
}
