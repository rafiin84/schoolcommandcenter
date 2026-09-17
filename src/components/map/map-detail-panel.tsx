"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowSquareOut,
  Envelope,
  Phone,
  Warning,
  X,
} from "@phosphor-icons/react/dist/ssr";
import type { GeographicHierarchy } from "@/types";
import { OnboardingStatusBadge, OperationalHealthBadge } from "@/components/shared/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { GeographyBreadcrumbs } from "@/components/map/geography-breadcrumbs";
import { ZohoAccessConfirmation } from "@/components/zoho/zoho-access-confirmation";
import { useEducationMapData, useSchoolDetails } from "@/hooks/use-map";
import { useZohoAccountForSchool } from "@/hooks/use-zoho";
import { useAlerts } from "@/hooks/use-alerts";
import { useLeadershipDirectory } from "@/hooks/use-directory";

export function MapDetailPanel({
  node,
  onClose,
}: {
  node: GeographicHierarchy;
  onClose: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isSchool = node.level === "school";

  const schoolDetails = useSchoolDetails(isSchool ? node.id : null);
  const zohoAccount = useZohoAccountForSchool(isSchool ? node.id : null);
  const alerts = useAlerts({ geographyId: node.id, sortBy: "priority" });
  const directory = useLeadershipDirectory({});
  const allNodes = useEducationMapData({});

  const contact = useMemo(() => {
    const contacts = directory.data?.data ?? [];
    return (
      contacts.find((c) => c.schoolId === node.id) ??
      contacts.find((c) => c.blockId === node.blockId) ??
      contacts.find((c) => c.districtId === node.districtId) ??
      contacts.find((c) => c.administrativeLevel === "state")
    );
  }, [directory.data, node]);

  const crumbs = useMemo(() => {
    const lookup = allNodes.data?.data ?? [];
    const districtNode =
      node.districtId && node.districtId !== node.id
        ? lookup.find((n) => n.id === node.districtId)
        : undefined;
    const blockNode =
      node.blockId && node.blockId !== node.id
        ? lookup.find((n) => n.id === node.blockId)
        : undefined;

    return [
      { label: "Tamil Nadu", href: "/education-map" },
      ...(districtNode ? [{ label: districtNode.name, href: `/education-map?focus=${districtNode.id}` }] : []),
      ...(blockNode ? [{ label: blockNode.name, href: `/education-map?focus=${blockNode.id}` }] : []),
      { label: node.name },
    ];
  }, [allNodes.data, node]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-border p-4 sm:p-5">
        <div className="min-w-0 space-y-2">
          <GeographyBreadcrumbs crumbs={crumbs} />
          <h2 className="truncate text-lg font-semibold text-foreground">{node.name}</h2>
          <div className="flex flex-wrap items-center gap-1.5">
            <OnboardingStatusBadge status={node.status} />
            <OperationalHealthBadge health={node.operationalHealth} />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close details" className="shrink-0">
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
        <ProgressBar value={node.onboardingProgress} label="Onboarding progress" />
        <ProgressBar value={node.engagementRate} label="Engagement rate" tone={node.engagementRate < 40 ? "critical" : "accent"} />

        {isSchool && schoolDetails.data && (
          <dl className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/40 p-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">School code</dt>
              <dd className="font-medium text-foreground">{schoolDetails.data.data.school.schoolCode}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Students</dt>
              <dd className="font-medium text-foreground">{schoolDetails.data.data.school.studentCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Teachers</dt>
              <dd className="font-medium text-foreground">{schoolDetails.data.data.school.teacherCount}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Address</dt>
              <dd className="font-medium text-foreground">{schoolDetails.data.data.school.address}</dd>
            </div>
          </dl>
        )}

        {!isSchool && (
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            This map has drilled in to show {node.level === "district" ? "blocks" : "schools"} within{" "}
            {node.name}. Use the breadcrumb above to go back.
          </p>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Open alerts
          </p>
          {alerts.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading alerts…</p>
          ) : alerts.data && alerts.data.data.filter((a) => a.status !== "resolved").length > 0 ? (
            <ul className="space-y-2">
              {alerts.data.data
                .filter((a) => a.status !== "resolved")
                .slice(0, 3)
                .map((alert) => (
                  <li key={alert.id}>
                    <Link
                      href={`/alerts/${alert.id}`}
                      className="flex items-start gap-2 rounded-lg border border-border p-2.5 text-sm hover:border-primary/40 hover:bg-accent"
                    >
                      <Warning size={15} className="mt-0.5 shrink-0 text-status-warning" />
                      <span className="text-foreground">{alert.title}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No open alerts for this entity.</p>
          )}
          <Link
            href={`/alerts?geographyId=${node.id}`}
            className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
          >
            View all alerts →
          </Link>
        </div>

        {contact && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Leadership contact
            </p>
            <div className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.title}</p>
              <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Envelope size={13} /> {contact.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} /> {contact.phone}
                </span>
              </div>
            </div>
          </div>
        )}

        {isSchool && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Zoho Classes account
            </p>
            {zohoAccount.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading account…</p>
            ) : zohoAccount.data?.data ? (
              <div className="space-y-3 rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{zohoAccount.data.data.accountName}</p>
                  <p className="text-xs text-muted-foreground">{zohoAccount.data.data.environmentLabel}</p>
                </div>
                <Button size="sm" className="w-full gap-2" onClick={() => setConfirmOpen(true)}>
                  Open Zoho Classes
                  <ArrowSquareOut size={14} />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No Zoho Classes account has been mapped yet — onboarding has not started.
              </p>
            )}
          </div>
        )}
      </div>

      {isSchool && zohoAccount.data?.data && (
        <ZohoAccessConfirmation
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          schoolName={node.name}
          account={zohoAccount.data.data}
        />
      )}
    </div>
  );
}
