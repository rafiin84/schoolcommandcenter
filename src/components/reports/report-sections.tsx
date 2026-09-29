"use client";

import { useMemo, useState } from "react";
import type { IconProps } from "@phosphor-icons/react";
import { AndroidLogo, DeviceMobile, MagnifyingGlass, Rss } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type {
  ReportAcademicItem,
  ReportAnnouncement,
  ReportAttendance,
  ReportCourse,
  ReportDevice,
  ReportDeviceSummary,
  ReportFeed,
} from "@/types";

export function ReportPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <h3 className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function Byline({ authorName, date }: { authorName?: string; date?: string }) {
  if (!authorName && !date) return null;
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
      {authorName && <span>{authorName}</span>}
      {authorName && date && <span aria-hidden>·</span>}
      {date && <span>{formatDateTime(date)}</span>}
    </p>
  );
}

function Tags({ yearLabel, subject }: { yearLabel: string; subject: string }) {
  return (
    <p className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-primary">
      <span className="shrink-0">{yearLabel}</span>
      <span aria-hidden className="text-muted-foreground/50">•</span>
      <span className="truncate" title={subject}>
        {subject}
      </span>
    </p>
  );
}

function PanelList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-border">{children}</ul>;
}

export function AnnouncementList({ items }: { items: ReportAnnouncement[] }) {
  return (
    <PanelList>
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            className="size-18 shrink-0 rounded-md border border-border object-cover"
          />
          <div className="min-w-0">
            <p className="line-clamp-3 text-sm text-foreground">{item.title}</p>
            <Byline authorName={item.authorName} date={item.createdAt} />
          </div>
        </li>
      ))}
    </PanelList>
  );
}

export function AcademicList({ items }: { items: ReportAcademicItem[] }) {
  return (
    <PanelList>
      {items.map((item) => (
        <li key={item.id} className="p-4">
          <Tags yearLabel={item.yearLabel} subject={item.subject} />
          <p className="mt-2 truncate text-sm font-semibold text-foreground" title={item.title}>
            {item.title}
          </p>
          {item.description && <p className="line-clamp-2 text-sm text-foreground/80">{item.description}</p>}
          <Byline authorName={item.authorName} date={item.createdAt} />
        </li>
      ))}
    </PanelList>
  );
}

const COURSE_TONE: Record<ReportCourse["tone"], string> = {
  green: "bg-emerald-200 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-50",
  purple: "bg-violet-400 text-violet-950 dark:bg-violet-900/70 dark:text-violet-50",
};

export function CourseList({ items }: { items: ReportCourse[] }) {
  return (
    <PanelList>
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 p-4">
          <div
            className={cn(
              "flex h-18 w-28 shrink-0 items-center rounded-md px-2.5 text-xs font-semibold leading-tight",
              COURSE_TONE[item.tone],
            )}
          >
            <span className="line-clamp-2">{item.title}</span>
          </div>
          <div className="min-w-0">
            <Tags yearLabel={item.yearLabel} subject={item.subject} />
            <p className="mt-1.5 line-clamp-2 text-sm text-foreground">{item.description}</p>
            <Byline authorName={item.authorName} date={item.publishedAt} />
          </div>
        </li>
      ))}
    </PanelList>
  );
}

function AttendanceTile({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-border py-8", className)}>
      <span className="text-lg font-semibold">{formatNumber(value)}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function AttendanceSummary({ attendance }: { attendance: ReportAttendance }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      <AttendanceTile
        value={attendance.totalPresent}
        label="Total Present Today"
        className="col-span-2 bg-primary/5 text-primary"
      />
      <AttendanceTile value={attendance.absent} label="Absent" className="bg-surface-sunken" />
      <AttendanceTile value={attendance.classesTaken} label="Classes Taken" className="bg-surface-sunken" />
    </div>
  );
}

export function FeedList({ items }: { items: ReportFeed[] }) {
  if (items.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon={Rss} title="No recent feeds" description="Feed posts from the institution will appear here." />
      </div>
    );
  }
  return (
    <PanelList>
      {items.map((item) => (
        <li key={item.id} className="p-4">
          <p className="line-clamp-3 text-sm text-foreground">{item.body}</p>
          <Byline authorName={item.authorName} date={item.createdAt} />
        </li>
      ))}
    </PanelList>
  );
}

function DeviceStat({ icon: Icon, value, label }: { icon: React.ComponentType<IconProps>; value: number; label: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-primary/5 p-4">
      <Icon size={24} weight="fill" className="text-primary" />
      <div>
        <p className="text-xl font-semibold text-foreground">{formatNumber(value)}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function DevicesDashboard({ summary, devices }: { summary: ReportDeviceSummary; devices: ReportDevice[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter((d) =>
      [d.name, d.platform, d.deviceModel, d.userType].some((field) => field.toLowerCase().includes(q)),
    );
  }, [devices, search]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DeviceStat icon={AndroidLogo} value={summary.androidFaculty} label="Android Faculty" />
        <DeviceStat icon={AndroidLogo} value={summary.androidStudent} label="Android Student" />
        <DeviceStat icon={DeviceMobile} value={summary.iosFaculty} label="iOS Faculty" />
        <DeviceStat icon={DeviceMobile} value={summary.iosStudent} label="iOS Student" />
      </div>

      <div className="relative w-full sm:ml-auto sm:max-w-xs">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="pl-9"
          aria-label="Search devices"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-surface-sunken">
            <TableRow>
              <TableHead className="px-4 font-semibold">Name</TableHead>
              <TableHead className="px-4 font-semibold">Platform</TableHead>
              <TableHead className="px-4 font-semibold">Device Model</TableHead>
              <TableHead className="px-4 font-semibold">User Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No devices match “{search}”.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="px-4 py-3">{d.name}</TableCell>
                  <TableCell className="px-4 py-3">{d.platform}</TableCell>
                  <TableCell className="px-4 py-3">{d.deviceModel}</TableCell>
                  <TableCell className="px-4 py-3">{d.userType}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
