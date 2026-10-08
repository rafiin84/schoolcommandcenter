"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Image as ImageIcon,
  MapPin,
  Palette,
  Paperclip,
  Sparkle,
  VideoCamera,
  X,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { Announcement, AnnouncementAttachment, AnnouncementCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDistrictSummaries } from "@/hooks/use-map";
import { useAnnouncementStore } from "@/store/announcement-store";

const STATEWIDE = "__statewide__";
const CURRENT_USER = { name: "State Education Reviewer", role: "You", initials: "SR" };

const AI_DRAFTS: Record<AnnouncementCategory, (title: string) => string> = {
  milestone: (title) =>
    `We're excited to share a milestone: ${title || "this update"}. It reflects strong progress across the Zoho Classes rollout, and it wouldn't be possible without the schools and educators driving it forward.`,
  update: (title) =>
    `Quick update on ${title || "this item"}: sharing the latest status so districts and blocks can plan next steps accordingly. More details to follow as things progress.`,
  insight: (title) =>
    `A quick insight worth flagging on ${title || "this topic"}: the data suggests it's worth a closer look this week, particularly for districts trailing the statewide average.`,
  guidance: (title) =>
    `Some guidance on ${title || "this process"}: please review the steps below and reach out to your block education officer if anything is unclear.`,
  introduction: (title) =>
    `Introducing ${title || "a new update"} — a quick heads-up for everyone in the network so you know what's changed and where to look for it.`,
};

const CATEGORY_LABEL: Record<AnnouncementCategory, string> = {
  milestone: "Milestone",
  update: "Update",
  insight: "Insight",
  guidance: "Guidance",
  introduction: "Introduction",
};

const composerSchema = z.object({
  title: z.string().trim().max(120, "Keep the title under 120 characters"),
  body: z.string().trim().min(10, "Write a bit more detail").max(2000),
  category: z.enum(["milestone", "update", "insight", "guidance", "introduction"]),
  audience: z.string(),
  youtubeUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /youtu\.?be/.test(v), "Enter a YouTube video URL")
    .optional(),
});

type ComposerValues = z.infer<typeof composerSchema>;

function deriveTitle(body: string): string {
  const firstLine = body.trim().split(/\n|(?<=[.!?])\s/)[0];
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}…` : firstLine;
}

function fileKind(file: File): AnnouncementAttachment["kind"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

let localAttachmentCounter = 0;

export function AnnouncementComposer() {
  const [expanded, setExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFiles, setLocalFiles] = useState<{ file: File; attachment: AnnouncementAttachment }[]>([]);
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const districts = useDistrictSummaries();
  const addAnnouncement = useAnnouncementStore((s) => s.addAnnouncement);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ComposerValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: { title: "", body: "", category: "update", audience: STATEWIDE, youtubeUrl: "" },
  });

  const category = watch("category");
  const title = watch("title");
  const body = watch("body");
  const audience = watch("audience");
  const audienceLabel =
    audience === STATEWIDE
      ? "Statewide"
      : `${districts.data?.data.find((d) => d.id === audience)?.name ?? "District"} district`;

  function collapse() {
    setExpanded(false);
    setShowAdvanced(false);
    reset({ title: "", body: "", category: "update", audience: STATEWIDE, youtubeUrl: "" });
    localFiles.forEach((f) => URL.revokeObjectURL(f.attachment.url));
    setLocalFiles([]);
  }

  function handleFilesSelected(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file) => {
      localAttachmentCounter += 1;
      const attachment: AnnouncementAttachment = {
        id: `local-${localAttachmentCounter}`,
        kind: fileKind(file),
        url: URL.createObjectURL(file),
        name: file.name,
      };
      return { file, attachment };
    });
    setLocalFiles((prev) => [...prev, ...next]);
  }

  function removeLocalFile(id: string) {
    setLocalFiles((prev) => {
      const match = prev.find((f) => f.attachment.id === id);
      if (match) URL.revokeObjectURL(match.attachment.url);
      return prev.filter((f) => f.attachment.id !== id);
    });
  }

  function generateWithAi() {
    setValue("body", AI_DRAFTS[category](title.trim()), { shouldValidate: true });
  }

  function onSubmit(values: ComposerValues) {
    const attachments: AnnouncementAttachment[] = [...localFiles.map((f) => f.attachment)];
    if (values.youtubeUrl) {
      attachments.push({
        id: `youtube-${Date.now()}`,
        kind: "youtube",
        url: values.youtubeUrl,
        name: "YouTube video",
      });
    }

    const districtList = districts.data?.data ?? [];
    const selectedDistrict =
      values.audience === STATEWIDE ? null : districtList.find((d) => d.id === values.audience) ?? null;

    const announcement: Announcement = {
      id: `announce-draft-${Date.now()}`,
      authorName: CURRENT_USER.name,
      authorRole: CURRENT_USER.role,
      authorInitials: CURRENT_USER.initials,
      createdAt: new Date().toISOString(),
      category: values.category,
      title: values.title || deriveTitle(values.body),
      body: values.body,
      audienceLabel: selectedDistrict ? `${selectedDistrict.name} district` : "Statewide",
      districtId: selectedDistrict?.id ?? null,
      attachments,
    };

    addAnnouncement(announcement);
    setPosted(true);
    collapse();
    setTimeout(() => setPosted(false), 4000);
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4 sm:p-5">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        className="hidden"
        onChange={(e) => {
          handleFilesSelected(e.target.files);
          e.target.value = "";
        }}
      />

      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex w-full items-center gap-3 text-left"
        >
          <Avatar>
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {CURRENT_USER.initials}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 rounded-full border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
            Share an announcement…
          </span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
            <ImageIcon size={18} />
          </span>
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex items-start gap-4">
            <Avatar className="size-11 shrink-0">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {CURRENT_USER.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              {showAdvanced && (
                <Input
                  placeholder="Title (optional)"
                  aria-label="Announcement title"
                  className="mb-1 h-9 border-none bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                  {...register("title")}
                />
              )}
              <Textarea
                autoFocus
                placeholder="Create an Announcement"
                aria-label="Announcement text"
                rows={4}
                className="min-h-24 resize-none border-none bg-transparent px-0 text-lg shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
                {...register("body")}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
              {showAdvanced && (
                <div className="mt-2">
                  <Input
                    placeholder="YouTube link (optional) — https://youtube.com/watch?v=…"
                    aria-label="YouTube link"
                    {...register("youtubeUrl")}
                  />
                  {errors.youtubeUrl && <p className="mt-1 text-xs text-destructive">{errors.youtubeUrl.message}</p>}
                </div>
              )}
              {localFiles.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {localFiles.map(({ attachment }) => {
                    const Icon = attachment.kind === "image" ? ImageIcon : attachment.kind === "video" ? VideoCamera : FileText;
                    return (
                      <li
                        key={attachment.id}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground"
                      >
                        <Icon size={13} />
                        <span className="max-w-40 truncate">{attachment.name}</span>
                        <button
                          type="button"
                          onClick={() => removeLocalFile(attachment.id)}
                          aria-label={`Remove ${attachment.name}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={collapse}
              aria-label="Close"
              className="shrink-0 text-foreground/80 hover:text-foreground"
            >
              <XCircle size={30} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach photo or document"
              title="Attach photo or document"
              className="text-foreground/80 hover:text-primary"
            >
              <Paperclip size={26} />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Category"
                    title={`Category: ${CATEGORY_LABEL[category]}`}
                    className="text-foreground/80 hover:text-primary"
                  />
                }
              >
                <Palette size={26} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {(Object.keys(CATEGORY_LABEL) as AnnouncementCategory[]).map((c) => (
                  <DropdownMenuItem key={c} onClick={() => setValue("category", c)}>
                    {CATEGORY_LABEL[c]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Audience"
                    title={`Audience: ${audienceLabel}`}
                    className="text-foreground/80 hover:text-primary"
                  />
                }
              >
                <MapPin size={26} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
                <DropdownMenuItem onClick={() => setValue("audience", STATEWIDE)}>Statewide</DropdownMenuItem>
                {(districts.data?.data ?? []).map((d) => (
                  <DropdownMenuItem key={d.id} onClick={() => setValue("audience", d.id)}>
                    {d.name} district
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="size-3 rounded-full bg-muted-foreground/20" aria-hidden />

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-pressed={showAdvanced}
              className="rounded-full border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              Advanced Editor
            </button>
            <button
              type="button"
              onClick={generateWithAi}
              className="flex items-center gap-2 rounded-full border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <Sparkle size={18} weight="fill" />
              Create With AI
            </button>

            <div className="ml-auto flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {CATEGORY_LABEL[category]} · {audienceLabel}
              </span>
              {posted && <span className="text-xs font-medium text-status-good">Posted below.</span>}
              <Button
                type="submit"
                disabled={isSubmitting || !body.trim()}
                className="h-11 rounded-full bg-muted px-7 text-base font-medium text-foreground enabled:bg-primary enabled:text-primary-foreground enabled:hover:bg-primary/90 disabled:opacity-100"
              >
                Submit
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Posted for this session only — attachments and AI drafts stay in your browser and nothing is uploaded to a
            server.
          </p>
        </form>
      )}
    </div>
  );
}
