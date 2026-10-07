"use client";

import { toast } from "sonner";
import { Envelope, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import type { LeadershipContact } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const LEVEL_LABEL: Record<LeadershipContact["administrativeLevel"], string> = {
  state: "State",
  district: "District",
  block: "Block",
  school: "School",
};

const LEVEL_ACCENT: Record<LeadershipContact["administrativeLevel"], { card: string; avatar: string; badge: string }> = {
  state: { card: "border border-border bg-card", avatar: "bg-accent text-primary", badge: "bg-accent text-primary" },
  district: { card: "border border-border bg-card", avatar: "bg-accent text-primary", badge: "bg-accent text-primary" },
  block: { card: "border border-border bg-card", avatar: "bg-accent text-primary", badge: "bg-accent text-primary" },
  school: { card: "border border-border bg-card", avatar: "bg-accent text-primary", badge: "bg-accent text-primary" },
};

function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ContactCard({
  contact,
  geographyLabel,
}: {
  contact: LeadershipContact;
  geographyLabel: string;
}) {
  const accent = LEVEL_ACCENT[contact.administrativeLevel];

  return (
    <div className={`flex flex-col gap-4 rounded-lg p-4 sm:p-5 ${accent.card}`}>
      <div className="flex items-start gap-3">
        <Avatar className="size-11">
          <AvatarFallback className={`font-semibold ${accent.avatar}`}>{initialsFor(contact.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{contact.name}</p>
          <p className="text-xs text-muted-foreground">{contact.title}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${accent.badge}`}>
          {LEVEL_LABEL[contact.administrativeLevel]}
        </span>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin size={13} /> {geographyLabel}
      </p>

      <p className="text-sm text-foreground">{contact.responsibility}</p>

      <p className="text-xs text-muted-foreground">{contact.availabilityLabel}</p>

      <div className="flex gap-2 border-t border-border pt-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() =>
            toast.success("Email drafted (simulated)", {
              description: `A message to ${contact.name} would open here in a connected environment.`,
            })
          }
        >
          <Envelope size={14} />
          Email
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() =>
            toast.success("Call initiated (simulated)", {
              description: `A call to ${contact.name} would start here in a connected environment.`,
            })
          }
        >
          <Phone size={14} />
          Call
        </Button>
      </div>
    </div>
  );
}

/** Compact one-line version of the card for the list view. */
export function ContactRow({ contact, geographyLabel }: { contact: LeadershipContact; geographyLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex min-w-60 flex-1 items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-accent font-semibold text-primary">{initialsFor(contact.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{contact.name}</p>
          <p className="truncate text-xs text-muted-foreground">{contact.title}</p>
        </div>
      </div>
      <p className="hidden min-w-40 items-center gap-1.5 text-xs text-muted-foreground lg:flex">
        <MapPin size={13} /> {geographyLabel}
      </p>
      <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-primary">
        {LEVEL_LABEL[contact.administrativeLevel]}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Email drafted (simulated)", { description: `A message to ${contact.name} would open here in a connected environment.` })}>
          <Envelope size={14} />
          Email
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Call initiated (simulated)", { description: `A call to ${contact.name} would start here in a connected environment.` })}>
          <Phone size={14} />
          Call
        </Button>
      </div>
    </div>
  );
}
