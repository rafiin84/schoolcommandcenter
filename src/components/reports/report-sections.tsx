"use client";

import { useMemo, useState } from "react";
import type { IconProps } from "@phosphor-icons/react";
import { AndroidLogo, AppleLogo, Clock, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionHeader } from "@/components/layout/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { avatarColorFor } from "@/components/announcements/announcement-card";
import { formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { ReportAcademicItem, ReportAnnouncement, ReportCourse, ReportDevice, ReportFeed } from "@/types";

// Same per-module tones as the Overview "Zoho Classes module activity" cards.
export type ReportTone = "navy" | "blue" | "orange" | "red" | "green" | "teal";

const TONE: Record<ReportTone, { chip: string; item: string; tile: string }> = {
  navy: { chip: "bg-primary/15 text-primary", item: "bg-primary/6", tile: "bg-primary/15 text-primary" },
  blue: { chip: "bg-chart-1/15 text-chart-1", item: "bg-chart-1/6", tile: "bg-chart-1/15 text-chart-1" },
  orange: { chip: "bg-chart-2/15 text-chart-2", item: "bg-chart-2/6", tile: "bg-chart-2/15 text-chart-2" },
  red: {
    chip: "bg-status-critical/15 text-status-critical",
    item: "bg-status-critical/6",
    tile: "bg-status-critical/15 text-status-critical",
  },
  green: { chip: "bg-chart-3/15 text-chart-3", item: "bg-chart-3/6", tile: "bg-chart-3/15 text-chart-3" },
  teal: {
    chip: "bg-brand-accent/15 text-brand-accent",
    item: "bg-brand-accent/6",
    tile: "bg-brand-accent/15 text-brand-accent",
  },
};

export function ReportPanel({
  title,
  description,
  icon: Icon,
  tone,
  count,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon: React.ComponentType<IconProps>;
  tone: ReportTone;
  count?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-4 sm:p-6", className)}>
      <SectionHeader
        title={title}
        description={description}
        actions={
          <>
            {count !== undefined && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {count} recent
              </span>
            )}
            <span className={cn("flex size-8 items-center justify-center rounded-lg", TONE[tone].chip)}>
              <Icon size={16} />
            </span>
          </>
        }
      />
      {children}
    </section>
  );
}

function initialsFor(name: string): string {
  return name
    .replace(/^dr\.?\s*/i, "")
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AuthorLine({ authorName, date }: { authorName?: string; date?: string }) {
  if (!authorName && !date) return null;
  return (
    <div className="mt-3 flex items-center gap-2">
      {authorName && (
        <Avatar size="sm">
          <AvatarFallback className={cn("text-[10px] font-semibold text-white", avatarColorFor(authorName))}>
            {initialsFor(authorName)}
          </AvatarFallback>
        </Avatar>
      )}
      <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
        {authorName && <span className="font-medium text-foreground">{authorName}</span>}
        {date && (
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {formatDateTime(date)}
          </span>
        )}
      </p>
    </div>
  );
}

function CourseTags({ yearLabel, subject }: { yearLabel: string; subject: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 rounded-full bg-card px-2.5 py-0.5 text-xs font-medium text-foreground ring-1 ring-border">
        {yearLabel}
      </span>
      <span className="truncate text-xs text-muted-foreground" title={subject}>
        {subject}
      </span>
    </div>
  );
}

function ItemList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-2.5">{children}</ul>;
}

export function AnnouncementList({ items, tone }: { items: ReportAnnouncement[]; tone: ReportTone }) {
  return (
    <ItemList>
      {items.map((item) => (
        <li key={item.id} className={cn("flex gap-3 rounded-xl p-3.5", TONE[tone].item)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt="" className="size-16 shrink-0 rounded-lg bg-card object-cover ring-1 ring-border" />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold text-foreground">{item.title}</p>
            <AuthorLine authorName={item.authorName} date={item.createdAt} />
          </div>
        </li>
      ))}
    </ItemList>
  );
}

export function AcademicList({ items, tone }: { items: ReportAcademicItem[]; tone: ReportTone }) {
  return (
    <ItemList>
      {items.map((item) => (
        <li key={item.id} className={cn("rounded-xl p-3.5", TONE[tone].item)}>
          <CourseTags yearLabel={item.yearLabel} subject={item.subject} />
          <p className="mt-2 truncate text-sm font-semibold text-foreground" title={item.title}>
            {item.title}
          </p>
          {item.description && item.description !== item.title && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          )}
          <AuthorLine authorName={item.authorName} date={item.createdAt} />
        </li>
      ))}
    </ItemList>
  );
}

export function CourseList({ items, tone }: { items: ReportCourse[]; tone: ReportTone }) {
  return (
    <ItemList>
      {items.map((item) => (
        <li key={item.id} className={cn("flex gap-3 rounded-xl p-3.5", TONE[tone].item)}>
          <div
            className={cn(
              "flex h-16 w-28 shrink-0 items-center rounded-lg px-2.5 text-xs font-semibold leading-tight break-words",
              TONE[tone].tile,
            )}
          >
            <span className="line-clamp-3">{item.title}</span>
          </div>
          <div className="min-w-0 flex-1">
            <CourseTags yearLabel={item.yearLabel} subject={item.subject} />
            <p className="mt-2 line-clamp-2 text-sm text-foreground">{item.description}</p>
            <AuthorLine authorName={item.authorName} date={item.publishedAt} />
          </div>
        </li>
      ))}
    </ItemList>
  );
}

export function FeedList({ items, tone }: { items: ReportFeed[]; tone: ReportTone }) {
  if (items.length === 0) {
    return <EmptyState title="No recent feeds" description="Class feed posts from the institution will appear here." />;
  }
  return (
    <ItemList>
      {items.map((item) => (
        <li key={item.id} className={cn("rounded-xl p-3.5", TONE[tone].item)}>
          <p className="line-clamp-3 text-sm text-foreground">{item.body}</p>
          <AuthorLine authorName={item.authorName} date={item.createdAt} />
        </li>
      ))}
    </ItemList>
  );
}

const PLATFORM_ICON: Record<ReportDevice["platform"], React.ComponentType<IconProps>> = {
  iOS: AppleLogo,
  ANDROID: AndroidLogo,
};

export function DeviceTable({ devices }: { devices: ReportDevice[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter((d) =>
      [d.name, d.platform, d.deviceModel, d.userType].some((field) => field.toLowerCase().includes(q)),
    );
  }, [devices, search]);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-section-heading">Registered devices</h3>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {devices.length} devices
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, platform or model…"
            className="pl-9"
            aria-label="Search devices"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              {["Name", "Platform", "Device model", "User type"].map((label) => (
                <TableHead
                  key={label}
                  className="px-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No devices match “{search}”.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => {
                const PlatformIcon = PLATFORM_ICON[d.platform];
                return (
                  <TableRow key={d.id}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm">
                          <AvatarFallback className={cn("text-[10px] font-semibold text-white", avatarColorFor(d.name))}>
                            {initialsFor(d.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{d.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-foreground">
                        <PlatformIcon size={14} weight="fill" className="text-muted-foreground" />
                        {d.platform === "iOS" ? "iOS" : "Android"}
                      </span>
                    </TableCell>
                    <TableCell className="text-data px-4 py-3">{d.deviceModel}</TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          d.userType === "Student" ? "bg-chart-1/10 text-chart-1" : "bg-brand-accent/10 text-brand-accent",
                        )}
                      >
                        {d.userType}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
