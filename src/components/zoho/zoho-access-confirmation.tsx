"use client";

import { ArrowSquareOut, LockKey, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { ZohoClassesAccount } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters";

export function ZohoAccessConfirmation({
  open,
  onOpenChange,
  schoolName,
  account,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolName: string;
  account: ZohoClassesAccount;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-accent" />
            Continue to Zoho Classes
          </DialogTitle>
          <DialogDescription>
            You&apos;re about to leave the Command Center for the mapped Zoho Classes environment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-xl border border-border bg-muted/50 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">School</span>
            <span className="font-medium text-foreground">{schoolName}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Account</span>
            <span className="font-medium text-foreground">{account.accountName}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Environment</span>
            <span className="font-medium text-foreground">{account.environmentLabel}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Destination</span>
            <span className="font-medium text-foreground">classes.zoho.com</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Last verified</span>
            <span className="font-medium text-foreground">{formatDateTime(account.lastVerifiedAt)}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-status-info/10 p-3 text-xs text-foreground">
          <LockKey size={16} className="mt-0.5 shrink-0 text-status-info" />
          <p>
            The Command Center does not store or transmit Zoho Classes passwords. You&apos;ll sign in
            on the Zoho Classes login page using your assigned email and password.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            nativeButton={false}
            render={
              <a href={account.loginUrl} target="_blank" rel="noopener noreferrer" />
            }
            className="gap-2"
            onClick={() => onOpenChange(false)}
          >
            Continue to Zoho Classes
            <ArrowSquareOut size={15} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
