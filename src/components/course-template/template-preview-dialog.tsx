"use client";

import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import type { CourseTemplate } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  template,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: CourseTemplate;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{template.title}</DialogTitle>
          {template.description && <DialogDescription>{template.description}</DialogDescription>}
        </DialogHeader>

        {template.embedUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              key={template.embedUrl}
              src={template.embedUrl}
              title={template.title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {template.sourceUrl && (
            <Button
              nativeButton={false}
              render={<a href={template.sourceUrl} target="_blank" rel="noopener noreferrer" />}
              className="gap-2"
            >
              Watch on YouTube
              <ArrowSquareOut size={15} />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
