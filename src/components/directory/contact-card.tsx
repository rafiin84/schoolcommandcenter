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
  state: { card: "border-l-primary", avatar: "bg-primary/10 text-primary", badge: "border-primary/30 bg-primary/8 text-primary" },
  district: { card: "border-l-chart-1", avatar: "bg-chart-1/10 text-chart-1", badge: "border-chart-1/30 bg-chart-1/8 text-chart-1" },
  block: { card: "border-l-brand-accent", avatar: "bg-brand-accent/10 text-brand-accent", badge: "border-brand-accent/30 bg-brand-accent/8 text-brand-accent" },
  school: { card: "border-l-chart-5", avatar: "bg-chart-5/10 text-chart-5", badge: "border-chart-5/30 bg-chart-5/8 text-chart-5" },
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
    <div className={`flex flex-col gap-4 rounded-2xl border-l-4 bg-card p-4 sm:p-5 ${accent.card}`}>
      <div className="flex items-start gap-3">
        <Avatar className="size-11">
          <AvatarFallback className={`font-semibold ${accent.avatar}`}>{initialsFor(contact.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{contact.name}</p>
          <p className="text-xs text-muted-foreground">{contact.title}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${accent.badge}`}>
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
