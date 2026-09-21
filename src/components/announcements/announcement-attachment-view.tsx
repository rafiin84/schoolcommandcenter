"use client";

import { FileText, Link as LinkIcon } from "@phosphor-icons/react/dist/ssr";
import type { AnnouncementAttachment } from "@/types";

function youtubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
}

export function AnnouncementAttachmentView({ attachment }: { attachment: AnnouncementAttachment }) {
  if (attachment.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={attachment.url}
        alt={attachment.name}
        className="max-h-80 w-full rounded-xl border border-border object-cover"
      />
    );
  }

  if (attachment.kind === "video") {
    return (
      <video controls className="max-h-80 w-full rounded-xl border border-border bg-black">
        <source src={attachment.url} />
      </video>
    );
  }

  if (attachment.kind === "youtube") {
    const embedUrl = youtubeEmbedUrl(attachment.url);
    if (embedUrl) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
          <iframe
            src={embedUrl}
            title={attachment.name}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {attachment.kind === "document" ? <FileText size={16} /> : <LinkIcon size={16} />}
      <span className="truncate">{attachment.name}</span>
    </a>
  );
}
