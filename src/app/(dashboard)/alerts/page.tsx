"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, FunnelSimple } from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { AlertFilters, type AlertFilterState } from "@/components/alerts/alert-filters";
import { AlertCard } from "@/components/alerts/alert-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAlerts } from "@/hooks/use-alerts";
import { useEducationMapData } from "@/hooks/use-map";
import type { AlertException } from "@/types";

function AlertsContent() {
  const searchParams = useSearchParams();
  const geographyId = searchParams.get("geographyId");

  const [filters, setFilters] = useState<AlertFilterState>({
    search: "",
    priority: [],
    status: [],
    category: [],
    sortBy: "priority",
  });
  const [groupByGeography, setGroupByGeography] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.priority.length +
    filters.status.length +
    filters.category.length +
    (groupByGeography ? 1 : 0);

  const alerts = useAlerts({
    search: filters.search || undefined,
    priority: filters.priority.length > 0 ? filters.priority : undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    category: filters.category.length > 0 ? filters.category : undefined,
    geographyId: geographyId ?? undefined,
    sortBy: filters.sortBy,
  });
  const allNodes = useEducationMapData({});

  const districtNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const node of allNodes.data?.data ?? []) {
      if (node.level === "district") map.set(node.id, node.name);
    }
    return map;
  }, [allNodes.data]);

  function resolveDistrictLabel(alert: AlertException): string {
    if (alert.geographyType === "district") return districtNameById.get(alert.geographyId) ?? "Unknown district";
    const node = (allNodes.data?.data ?? []).find((n) => n.id === alert.geographyId);
    if (!node?.districtId) return "Statewide";
    return districtNameById.get(node.districtId) ?? "Unknown district";
  }

  const data = alerts.data?.data ?? [];
  const counts = {
    total: data.length,
    open: data.filter((a) => a.status === "open").length,
    critical: data.filter((a) => a.priority === "critical").length,
  };

  const grouped = useMemo(() => {
    if (!groupByGeography) return null;
    const map = new Map<string, AlertException[]>();
    for (const alert of data) {
      const key = resolveDistrictLabel(alert);
      map.set(key, [...(map.get(key) ?? []), alert]);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupByGeography, data, allNodes.data]);

  return (
    <ContentContainer className="max-w-none px-3 sm:px-4 lg:px-4">
      <PageHeader
        eyebrow="Tamil Nadu · Oversight"
        title="Alerts & Exceptions"
        description="Target-based exceptions across deployment, engagement, operational health, and support."
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setFiltersOpen(true)}>
            <FunnelSimple size={15} />
            Filter
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary/8 p-3">
          <p className="text-xs text-muted-foreground">Total matching</p>
          <p className="text-xl font-semibold tabular-nums">{counts.total}</p>
        </div>
        <div className="rounded-xl bg-status-critical/8 p-3">
          <p className="text-xs text-muted-foreground">Open</p>
          <p className="text-xl font-semibold tabular-nums text-status-critical">{counts.open}</p>
        </div>
        <div className="rounded-xl bg-chart-4/8 p-3">
          <p className="text-xs text-muted-foreground">Critical priority</p>
          <p className="text-xl font-semibold tabular-nums">{counts.critical}</p>
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-5 py-5">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-5">
            <AlertFilters value={filters} onChange={setFilters} />
            <div className="flex items-center gap-2 border-t border-border pt-4">
              <Switch id="group-toggle" checked={groupByGeography} onCheckedChange={setGroupByGeography} />
              <Label htmlFor="group-toggle" className="text-sm text-muted-foreground">
                Group by district
              </Label>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {alerts.isLoading ? (
        <ListSkeleton count={6} />
      ) : alerts.isError ? (
        <ErrorState onRetry={() => alerts.refetch()} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No alerts match these filters"
          description="Try clearing a filter, or check back later as new mock alerts are generated."
        />
      ) : grouped ? (
        <div className="space-y-8">
          {grouped.map(([district, districtAlerts]) => (
            <section key={district}>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                {district} <span className="font-normal text-muted-foreground">({districtAlerts.length})</span>
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {districtAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </ContentContainer>
  );
}

export default function AlertsPage() {
  return (
    <Suspense fallback={null}>
      <AlertsContent />
    </Suspense>
  );
}
