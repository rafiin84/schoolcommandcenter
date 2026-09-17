"use client";

import { useState } from "react";
import { ArrowSquareOut, Buildings, CheckCircle, Clock, XCircle } from "@phosphor-icons/react/dist/ssr";
import type { ZohoAccountStatus, ZohoClassesAccount } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters";
import { ZohoAccessConfirmation } from "./zoho-access-confirmation";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<ZohoAccountStatus, { label: string; icon: typeof CheckCircle; className: string }> = {
  active: { label: "Active", icon: CheckCircle, className: "text-status-good" },
  pending: { label: "Pending", icon: Clock, className: "text-status-warning" },
  suspended: { label: "Suspended", icon: XCircle, className: "text-status-critical" },
};

export function ZohoAccountCard({
  account,
  schoolName,
  districtName,
  blockName,
}: {
  account: ZohoClassesAccount;
  schoolName: string;
  districtName?: string;
  blockName?: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = STATUS_CONFIG[account.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{schoolName}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Buildings size={12} />
            {[blockName, districtName].filter(Boolean).join(", ")}
          </p>
        </div>
        <span className={cn("flex shrink-0 items-center gap-1 text-xs font-medium", status.className)}>
          <StatusIcon size={14} weight="fill" />
          {status.label}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-muted-foreground">Account reference</dt>
          <dd className="text-data font-medium text-foreground">{account.accountReference}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Environment</dt>
          <dd className="font-medium text-foreground">{account.environmentLabel}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Last verified</dt>
          <dd className="text-data font-medium text-foreground">{formatDateTime(account.lastVerifiedAt)}</dd>
        </div>
      </dl>

      <Button
        size="sm"
        variant={account.status === "suspended" ? "outline" : "default"}
        className="w-full gap-2"
        onClick={() => setConfirmOpen(true)}
      >
        Open Zoho Classes
        <ArrowSquareOut size={14} />
      </Button>

      <ZohoAccessConfirmation
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        schoolName={schoolName}
        account={account}
      />
    </div>
  );
}
