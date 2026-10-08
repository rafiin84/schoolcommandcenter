"use client";

import { useState } from "react";
import {
  ArrowSquareOut,
  Buildings,
  Check,
  CheckCircle,
  Clock,
  Copy,
  EnvelopeSimple,
  Phone,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { DirectorySchoolAccount, ZohoAccountStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters";
import { DirectoryAccessConfirmation } from "./directory-access-confirmation";
import { cn } from "@/lib/utils";

/** Illustrative contact number — the dataset has none, so derive a stable one from the account id. */
function mockPhone(id: string): string {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const n = String(h % 100000000).padStart(8, "0");
  return `+91 44 ${n.slice(0, 4)} ${n.slice(4)}`;
}

function ContactButtons({ account }: { account: DirectorySchoolAccount }) {
  const phone = mockPhone(account.id);
  return (
    <>
      <Button size="sm" variant="secondary" aria-label="Call" title={phone} render={<a href={`tel:${phone.replace(/\s/g, "")}`} />} nativeButton={false} className="gap-2 border border-border bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground">
        <Phone size={14} />
        Call
      </Button>
      <Button size="sm" variant="secondary" aria-label="Email" title={account.loginEmail} render={<a href={`mailto:${account.loginEmail}`} />} nativeButton={false} className="gap-2 border border-border bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground">
        <EnvelopeSimple size={14} />
        Email
      </Button>
    </>
  );
}

const STATUS_CONFIG: Record<
  ZohoAccountStatus,
  { label: string; icon: typeof CheckCircle; className: string; accent: string }
> = {
  active: { label: "Active", icon: CheckCircle, className: "text-status-good", accent: "border border-border bg-card" },
  pending: { label: "Pending", icon: Clock, className: "text-status-warning", accent: "border border-border bg-card" },
  suspended: { label: "Suspended", icon: XCircle, className: "text-status-critical", accent: "border border-border bg-card" },
};

export function DirectoryAccountCard({ account, number }: { account: DirectorySchoolAccount; number: number }) {
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
    <div className={cn("flex flex-col gap-4 rounded-lg p-4 sm:p-5", status.accent)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Zoho Account {number}</p>
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
        {account.accessTokenLast4 && (
          <div>
            <dt className="text-muted-foreground">Access token</dt>
            <dd className="text-data font-medium text-foreground">••••{account.accessTokenLast4}</dd>
          </div>
        )}
      </dl>

      <div className="flex gap-2">
        <Button size="sm" variant="secondary" className="flex-1 gap-2" onClick={() => setConfirmOpen(true)}>
          Open Zoho Classes
          <ArrowSquareOut size={14} />
        </Button>
        <ContactButtons account={account} />
      </div>

      <DirectoryAccessConfirmation open={confirmOpen} onOpenChange={setConfirmOpen} account={account} />
    </div>
  );
}

/** Compact one-line version of the card for the list view. */
export function DirectoryAccountRow({ account, number }: { account: DirectorySchoolAccount; number: number }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = STATUS_CONFIG[account.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-card px-4 py-3">
      <div className="min-w-48 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">Zoho Account {number}</p>
        <p className="text-xs text-muted-foreground">
          {account.blockLabel}, {account.districtName}
        </p>
      </div>
      <p className="text-data hidden min-w-56 flex-1 truncate text-xs text-foreground lg:block">{account.loginEmail}</p>
      <p className="hidden w-44 text-xs text-muted-foreground xl:block">{formatDateTime(account.lastVerifiedAt)}</p>
      <span className={cn("flex w-24 shrink-0 items-center gap-1 text-xs font-medium", status.className)}>
        <StatusIcon size={14} weight="fill" />
        {status.label}
      </span>
      <Button size="sm" variant="secondary" className="gap-2" onClick={() => setConfirmOpen(true)}>
        Open Zoho Classes
        <ArrowSquareOut size={14} />
      </Button>
      <ContactButtons account={account} />
      <DirectoryAccessConfirmation open={confirmOpen} onOpenChange={setConfirmOpen} account={account} />
    </div>
  );
}
