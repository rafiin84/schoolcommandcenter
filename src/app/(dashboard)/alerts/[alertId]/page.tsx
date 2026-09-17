"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowSquareOut,
  CalendarBlank,
  Envelope,
  MapTrifold,
  Phone,
} from "@phosphor-icons/react/dist/ssr";
import { ContentContainer } from "@/components/layout/content-container";
import { PageHeader } from "@/components/layout/page-header";
import { GeographyBreadcrumbs } from "@/components/map/geography-breadcrumbs";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { MetricComparison } from "@/components/dashboard/metric-comparison";
import { SuggestedActionList } from "@/components/ai/suggested-action-list";
import { ErrorState } from "@/components/shared/error-state";
import { ChartSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlertDetails } from "@/hooks/use-alerts";
import { useEducationMapData } from "@/hooks/use-map";
import { useLeadershipDirectory } from "@/hooks/use-directory";
import { useZohoAccountForSchool } from "@/hooks/use-zoho";
import { ALERT_CATEGORY_LABEL } from "@/lib/constants";
import { formatDate, geographyBreadcrumbLabel } from "@/lib/formatters";
import type { AlertStatus } from "@/types";

const STATUS_LABEL: Record<AlertStatus, string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
};

export default function AlertDetailPage() {
  const params = useParams<{ alertId: string }>();
  const router = useRouter();
  const alertId = params.alertId;

  const alertQuery = useAlertDetails(alertId);
  const allNodes = useEducationMapData({});
  const directory = useLeadershipDirectory({});

  const alert = alertQuery.data?.data;
  const [localStatus, setLocalStatus] = useState<AlertStatus | null>(null);
  const displayStatus = localStatus ?? alert?.status;

  const geographyNode = useMemo(
    () => (allNodes.data?.data ?? []).find((n) => n.id === alert?.geographyId),
    [allNodes.data, alert],
  );
  const isSchoolAlert = alert?.geographyType === "school";
  const zohoAccount = useZohoAccountForSchool(isSchoolAlert ? alert!.geographyId : null);

  const contact = directory.data?.data.find((c) => c.id === alert?.responsibleContactId);

  if (alertQuery.isLoading) {
    return (
      <ContentContainer>
        <ChartSkeleton />
      </ContentContainer>
    );
  }

  if (alertQuery.isError || !alert) {
    return (
      <ContentContainer>
        <ErrorState
          title="Couldn't load this alert"
          description="The alert may not exist, or there was a problem loading it."
          onRetry={() => alertQuery.refetch()}
        />
      </ContentContainer>
    );
  }

  function handleStatusChange(next: AlertStatus) {
    setLocalStatus(next);
    toast.success(`Status updated to "${STATUS_LABEL[next]}" (simulated)`, {
      description: "This change is illustrative only and is not persisted to a backend.",
    });
  }

  return (
    <ContentContainer className="max-w-4xl">
      <PageHeader
        breadcrumbs={
          <GeographyBreadcrumbs
            crumbs={[
              { label: "Alerts & Exceptions", href: "/alerts" },
              { label: alert.title },
            ]}
          />
        }
        eyebrow={`${ALERT_CATEGORY_LABEL[alert.category]} · ${geographyBreadcrumbLabel(alert.geographyType)}`}
        title={alert.title}
        description={alert.description}
        actions={<PriorityBadge priority={alert.priority} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-section-heading">Supporting metric</h2>
            <MetricComparison
              metricName={alert.metricName}
              currentValue={alert.currentValue}
              targetValue={alert.targetValue}
              maxScale={alert.metricName.includes("Tickets") ? undefined : 100}
            />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 text-section-heading">Suggested follow-up</h2>
            <SuggestedActionList actions={[alert.recommendedAction]} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 text-section-heading">Timeline</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CalendarBlank size={15} />
                Created {formatDate(alert.createdAt)}
              </li>
              {alert.dueAt && (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CalendarBlank size={15} />
                  Due {formatDate(alert.dueAt)}
                </li>
              )}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </h2>
            <Select value={displayStatus} onValueChange={(v) => handleStatusChange(v as AlertStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              Status changes here are simulated for demonstration and are not saved.
            </p>
          </section>

          {geographyNode && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Geographic context
              </h2>
              <p className="mb-3 text-sm font-medium text-foreground">{geographyNode.name}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                nativeButton={false}
                render={<Link href={`/education-map?focus=${geographyNode.id}`} />}
              >
                <MapTrifold size={15} />
                View on Education Map
              </Button>
            </section>
          )}

          {contact && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Responsible stakeholder
              </h2>
              <p className="text-sm font-medium text-foreground">{contact.name}</p>
              <p className="mb-2 text-xs text-muted-foreground">{contact.title}</p>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Envelope size={13} /> {contact.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} /> {contact.phone}
                </span>
              </div>
            </section>
          )}

          {isSchoolAlert && zohoAccount.data?.data && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Zoho Classes account
              </h2>
              <p className="mb-3 text-sm text-foreground">{zohoAccount.data.data.accountName}</p>
              <Button
                size="sm"
                className="w-full gap-2"
                nativeButton={false}
                render={<Link href="/zoho-access" />}
              >
                View in Zoho Access
                <ArrowSquareOut size={14} />
              </Button>
            </section>
          )}
        </div>
      </div>

      <Button variant="ghost" size="sm" className="mt-6" onClick={() => router.push("/alerts")}>
        ← Back to all alerts
      </Button>
    </ContentContainer>
  );
}
