"use client";

import { Clock, Trash } from "@phosphor-icons/react/dist/ssr";
import type { Announcement } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime, formatRelativeTime } from "@/lib/formatters";
import {
  ANNOUNCEMENT_CATEGORY_BADGE_CLASS,
  ANNOUNCEMENT_CATEGORY_LABEL,
} from "@/lib/constants/announcement-categories";
import { useAnnouncementStore } from "@/store/announcement-store";
import { AnnouncementAttachmentView } from "./announcement-attachment-view";

const AVATAR_COLORS = [
  "bg-rose-600",
  "bg-indigo-600",
  "bg-teal-600",
  "bg-amber-600",
  "bg-sky-600",
  "bg-fuchsia-600",
];

function avatarColorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const dismissAnnouncement = useAnnouncementStore((s) => s.dismissAnnouncement);

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <header className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback className={`text-xs font-semibold text-white ${avatarColorFor(announcement.authorName)}`}>
            {announcement.authorInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{announcement.authorName}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground" title={formatDateTime(announcement.createdAt)}>
            <Clock size={11} />
            {formatRelativeTime(announcement.createdAt)}
            <span aria-hidden>·</span>
            {announcement.audienceLabel}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${ANNOUNCEMENT_CATEGORY_BADGE_CLASS[announcement.category]}`}
          >
            {ANNOUNCEMENT_CATEGORY_LABEL[announcement.category]}
          </span>
          <button
            type="button"
            onClick={() => dismissAnnouncement(announcement.id)}
            aria-label="Remove announcement"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash size={15} />
          </button>
        </div>
      </header>

      <div>
        <h3 className="text-section-heading mb-1">{announcement.title}</h3>
        <p className="text-body whitespace-pre-line text-muted-foreground">{announcement.body}</p>
      </div>

      {announcement.attachments.length > 0 && (
        <div className={announcement.attachments.length === 1 ? "" : "grid gap-2 sm:grid-cols-2"}>
          {announcement.attachments.map((attachment) => (
            <AnnouncementAttachmentView key={attachment.id} attachment={attachment} />
          ))}
        </div>
      )}
    </article>
  );
}
