"use client";

import { useState } from "react";
import {
  ArrowSquareOut,
  Buildings,
  Check,
  CheckCircle,
  Clock,
  Copy,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { DirectorySchoolAccount, ZohoAccountStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters";
import { DirectoryAccessConfirmation } from "./directory-access-confirmation";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ZohoAccountStatus,
  { label: string; icon: typeof CheckCircle; className: string; accent: string }
> = {
  active: { label: "Active", icon: CheckCircle, className: "text-status-good", accent: "border-l-status-good bg-status-good/5" },
  pending: { label: "Pending", icon: Clock, className: "text-status-warning", accent: "border-l-status-warning bg-status-warning/6" },
  suspended: { label: "Suspended", icon: XCircle, className: "text-status-critical", accent: "border-l-status-critical bg-status-critical/6" },
};

export function DirectoryAccountCard({ account }: { account: DirectorySchoolAccount }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const status = STATUS_CONFIG[account.status];
  const StatusIcon = status.icon;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(account.loginEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied by the browser — nothing to recover from here.
    }
  }

  return (
    <div className={cn("flex flex-col gap-4 rounded-2xl border border-l-4 border-border p-4 sm:p-5", status.accent)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{account.schoolName}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Buildings size={12} />
            {account.blockLabel}, {account.districtName}
          </p>
        </div>
        <span className={cn("flex shrink-0 items-center gap-1 text-xs font-medium", status.className)}>
          <StatusIcon size={14} weight="fill" />
          {status.label}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-2.5">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Login email</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-data flex-1 truncate text-xs font-medium text-foreground">{account.loginEmail}</p>
          <button
            type="button"
            onClick={copyEmail}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Copy login email"
          >
            {copied ? <Check size={14} className="text-status-good" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-muted-foreground">Environment</dt>
          <dd className="font-medium text-foreground">{account.environmentLabel}</dd>
        </div>
        <div>
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

      <DirectoryAccessConfirmation open={confirmOpen} onOpenChange={setConfirmOpen} account={account} />
    </div>
  );
}
