"use client";

import { useState } from "react";
import {
  ArrowSquareOut,
  ClipboardText,
  FilePdf,
  FileText,
  PlayCircle,
  Stack,
  VideoCamera,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import type { CourseTemplate, CourseTemplateContentType } from "@/types";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/formatters";
import { useCourseTemplateMedia } from "@/hooks/use-course-template-media";
import { TemplatePreviewDialog } from "./template-preview-dialog";

const CONTENT_TYPE_ICON: Record<CourseTemplateContentType, React.ComponentType<{ size?: number; className?: string }>> = {
  youtube: YoutubeLogo,
  video: VideoCamera,
  pdf: FilePdf,
  text: FileText,
  exam: ClipboardText,
  mixed: Stack,
};

const CARD_PALETTE = [
  "#F4D06F",
  "#E8927C",
  "#9DC3D4",
  "#3E8E7E",
  "#D9C6AE",
  "#F3C6D9",
  "#D98552",
  "#B9A9C9",
];

function cardColorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return CARD_PALETTE[hash % CARD_PALETTE.length];
}

export function TemplateCard({ template }: { template: CourseTemplate }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const media = useCourseTemplateMedia(template.id);
  const resolved = media.data ? { ...template, ...media.data } : template;
  const Icon = CONTENT_TYPE_ICON[template.contentType];
  const canPreview = Boolean(resolved.embedUrl);
  const color = cardColorFor(template.id);

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <button
          type="button"
          onClick={() => canPreview && setPreviewOpen(true)}
          disabled={!canPreview}
          className="group relative aspect-video w-full overflow-hidden disabled:cursor-default"
          style={{ backgroundColor: color }}
        >
          <span className="absolute -top-8 -left-8 size-28 rounded-[40%] bg-white/20" />
          <span className="absolute -bottom-10 -right-6 size-24 rounded-full bg-black/10" />

          <span className="absolute inset-x-4 top-4 line-clamp-3 text-left text-base font-bold leading-snug text-foreground/90 drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">
            {template.title}
          </span>

          <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm">
            <Icon size={15} />
          </span>

          {canPreview && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
              <PlayCircle
                size={40}
                weight="fill"
                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>
          )}
        </button>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">{template.title}</p>
          {template.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
            <span>{[template.language, template.country].filter(Boolean).join(" · ") || "—"}</span>
            {template.modifiedAt && <span>{formatRelativeTime(template.modifiedAt)}</span>}
          </div>
          <div className="flex gap-2 pt-1">
            {canPreview ? (
              <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => setPreviewOpen(true)}>
                <PlayCircle size={15} />
                Preview
              </Button>
            ) : media.isLoading ? (
              <Button size="sm" variant="outline" className="w-full" disabled>
                Loading…
              </Button>
            ) : resolved.sourceUrl ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2"
                nativeButton={false}
                render={<a href={resolved.sourceUrl} target="_blank" rel="noopener noreferrer" />}
              >
                Open source
                <ArrowSquareOut size={14} />
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="w-full" disabled>
                Preview unavailable
              </Button>
            )}
          </div>
        </div>
      </div>

      {canPreview && (
        <TemplatePreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} template={resolved} />
      )}
    </>
  );
}
